import { CASE, type Evidence, type TimelineEvent } from './case-data'
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
  keyEvidenceIds: string[]
  motive: string
  correct: boolean
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
  notes: string
  accusation: PublicAccusation | null
}

function evidenceForPhase(maxPhase: number): Evidence[] {
  return CASE.evidence.filter((e) => e.phase <= maxPhase)
}

export function getPublicState(code: string): PublicGameState | null {
  const row = getGameRow(code)
  if (!row) return null

  const readEvidenceIds: string[] = JSON.parse(row.read_evidence_ids)
  const unlockedEvidence = evidenceForPhase(row.current_phase)
  const allCurrentRead = unlockedEvidence.every((e) => readEvidenceIds.includes(e.id))
  const accusation: PublicAccusation | null = row.accusation ? JSON.parse(row.accusation) : null

  return {
    code,
    title: CASE.title,
    tagline: CASE.tagline,
    briefing: CASE.briefing,
    victim: CASE.victim,
    suspects: CASE.suspects,
    currentPhase: row.current_phase,
    totalPhases: TOTAL_PHASES,
    unlockedEvidence,
    readEvidenceIds,
    canAdvancePhase: allCurrentRead && row.current_phase < TOTAL_PHASES,
    timeline: CASE.timeline.filter((t) => t.phase <= row.current_phase),
    hints: CASE.hints.slice(0, row.current_phase),
    notes: row.notes,
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

export function resetAccusation(code: string) {
  const row = getGameRow(code)
  if (!row) throw new Error('Expediente no encontrado')
  updateGameRow(code, { accusation: null })
}

export function submitAccusation(
  code: string,
  payload: { suspectId: string; keyEvidenceIds: string[]; motive: string }
): PublicAccusation {
  const row = getGameRow(code)
  if (!row) throw new Error('Expediente no encontrado')

  const sol = CASE.solution
  const selected = payload.keyEvidenceIds
  const hasRequired = sol.requiredKeyEvidenceIds.every((id) => selected.includes(id))
  const supportingCount = sol.supportingKeyEvidenceIds.filter((id) =>
    selected.includes(id)
  ).length
  const correct =
    payload.suspectId === sol.guiltySuspectId &&
    hasRequired &&
    supportingCount >= sol.minSupporting

  const guilty = CASE.suspects.find((s) => s.id === sol.guiltySuspectId)!

  // El culpable y el epílogo solo se revelan si la acusación es correcta:
  // una acusación errónea no debe spoilear la solución.
  const accusation: PublicAccusation = {
    suspectId: payload.suspectId,
    keyEvidenceIds: selected,
    motive: payload.motive,
    correct,
    explanation: correct ? sol.explanation : '',
    guiltySuspectName: correct ? guilty.name : '',
    submittedAt: new Date().toISOString(),
  }

  updateGameRow(code, { accusation: JSON.stringify(accusation) })
  return accusation
}
