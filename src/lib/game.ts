import {
  CASE,
  EVIDENCE_LOCATION,
  type AccusationAxisOption,
  type Evidence,
  type TimelineEvent,
} from './case-data'
import { getGameRow, insertGameRow, updateGameRow } from './db'

const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789' // sin 0/O/1/I/L para evitar confusiones
const CODE_LENGTH = 6
const TOTAL_PHASES = 3

function generateCode(): string {
  let code = ''
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)]
  }
  return code
}

export function createGame(): string {
  let code = generateCode()
  while (getGameRow(code)) {
    code = generateCode()
  }
  insertGameRow(code)
  return code
}

export interface PublicAccusation {
  suspectId: string
  entryMethodId: string
  motiveId: string
  keyEvidenceIds: string[]
  motive: string
  correct: boolean
  // Pistas de orientación para un intento fallido (sin revelar la solución):
  // cuántos de los tres ejes son correctos y si las pruebas aportadas bastan.
  axesCorrect: number
  enoughEvidence: boolean
  explanation: string
  guiltySuspectName: string
  submittedAt: string
}

export interface PublicGameState {
  code: string
  title: string
  tagline: string
  briefing: string
  victim: typeof CASE.victim
  suspects: typeof CASE.suspects
  currentPhase: number
  totalPhases: number
  unlockedEvidence: Evidence[]
  readEvidenceIds: string[]
  canAdvancePhase: boolean
  timeline: TimelineEvent[]
  hints: string[]
  accusationOptions: {
    entryMethods: AccusationAxisOption[]
    motives: AccusationAxisOption[]
  }
  notes: string
  board: Record<string, Record<string, string>>
  accusation: PublicAccusation | null
}

function evidenceForPhase(maxPhase: number): Evidence[] {
  return CASE.evidence
    .filter((e) => e.phase <= maxPhase)
    .map((e) => ({ ...e, location: EVIDENCE_LOCATION[e.id] }))
}

export function getPublicState(code: string): PublicGameState | null {
  const row = getGameRow(code)
  if (!row) return null

  const readEvidenceIds: string[] = JSON.parse(row.read_evidence_ids)
  const unlockedEvidence = evidenceForPhase(row.current_phase)
  const allCurrentRead = unlockedEvidence.every((e) => readEvidenceIds.includes(e.id))
  const accusation: PublicAccusation | null = row.accusation ? JSON.parse(row.accusation) : null

  // Solo se puede confrontar a un sospechoso con pruebas que ya se han desbloqueado.
  const unlockedIds = new Set(unlockedEvidence.map((e) => e.id))
  const suspects = CASE.suspects.map((s) => ({
    ...s,
    responses: s.responses.filter((r) => unlockedIds.has(r.evidenceId)),
  }))

  return {
    code,
    title: CASE.title,
    tagline: CASE.tagline,
    briefing: CASE.briefing,
    victim: CASE.victim,
    suspects,
    currentPhase: row.current_phase,
    totalPhases: TOTAL_PHASES,
    unlockedEvidence,
    readEvidenceIds,
    canAdvancePhase: allCurrentRead && row.current_phase < TOTAL_PHASES,
    timeline: CASE.timeline.filter((t) => t.phase <= row.current_phase),
    hints: CASE.hints.slice(0, row.current_phase),
    accusationOptions: {
      entryMethods: CASE.solution.entryMethodOptions,
      motives: CASE.solution.motiveOptions,
    },
    notes: row.notes,
    board: JSON.parse(row.board || '{}'),
    accusation,
  }
}

export function markEvidenceRead(code: string, evidenceId: string) {
  const row = getGameRow(code)
  if (!row) throw new Error('Expediente no encontrado')
  const readEvidenceIds: string[] = JSON.parse(row.read_evidence_ids)
  if (!readEvidenceIds.includes(evidenceId)) {
    readEvidenceIds.push(evidenceId)
  }
  updateGameRow(code, { read_evidence_ids: JSON.stringify(readEvidenceIds) })
}

export function advancePhase(code: string) {
  const state = getPublicState(code)
  if (!state) throw new Error('Expediente no encontrado')
  if (!state.canAdvancePhase) throw new Error('Aún quedan pruebas de esta fase por revisar')
  updateGameRow(code, { current_phase: state.currentPhase + 1 })
}

export function saveNotes(code: string, notes: string) {
  const row = getGameRow(code)
  if (!row) throw new Error('Expediente no encontrado')
  updateGameRow(code, { notes })
}

export function saveBoard(code: string, board: Record<string, Record<string, string>>) {
  const row = getGameRow(code)
  if (!row) throw new Error('Expediente no encontrado')
  updateGameRow(code, { board: JSON.stringify(board) })
}

export function resetAccusation(code: string) {
  const row = getGameRow(code)
  if (!row) throw new Error('Expediente no encontrado')
  updateGameRow(code, { accusation: null })
}

export function submitAccusation(
  code: string,
  payload: {
    suspectId: string
    entryMethodId: string
    motiveId: string
    keyEvidenceIds: string[]
    motive: string
  }
): PublicAccusation {
  const row = getGameRow(code)
  if (!row) throw new Error('Expediente no encontrado')

  const sol = CASE.solution
  const selected = payload.keyEvidenceIds
  const axesCorrect =
    (payload.suspectId === sol.guiltySuspectId ? 1 : 0) +
    (payload.entryMethodId === sol.entryMethodId ? 1 : 0) +
    (payload.motiveId === sol.motiveId ? 1 : 0)
  const decisiveCount = sol.decisiveKeyEvidenceIds.filter((id) =>
    selected.includes(id)
  ).length
  const enoughEvidence = decisiveCount >= sol.minDecisive
  const correct = axesCorrect === 3 && enoughEvidence

  const guilty = CASE.suspects.find((s) => s.id === sol.guiltySuspectId)!

  // El culpable y el epílogo solo se revelan si la acusación es correcta:
  // una acusación errónea no debe spoilear la solución.
  const accusation: PublicAccusation = {
    suspectId: payload.suspectId,
    entryMethodId: payload.entryMethodId,
    motiveId: payload.motiveId,
    keyEvidenceIds: selected,
    motive: payload.motive,
    correct,
    axesCorrect,
    enoughEvidence,
    explanation: correct ? sol.explanation : '',
    guiltySuspectName: correct ? guilty.name : '',
    submittedAt: new Date().toISOString(),
  }

  updateGameRow(code, { accusation: JSON.stringify(accusation) })
  return accusation
}
