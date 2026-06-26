'use server'

import {
  advancePhase,
  createGame,
  getPublicState,
  markEvidenceRead,
  resetAccusation,
  saveNotes,
  submitAccusation,
  type PublicGameState,
} from './game'

export async function createGameAction(): Promise<{ code: string }> {
  const code = createGame()
  return { code }
}

export async function getGameStateAction(code: string): Promise<PublicGameState | null> {
  return getPublicState(code.toUpperCase())
}

export async function markEvidenceReadAction(code: string, evidenceId: string): Promise<PublicGameState | null> {
  markEvidenceRead(code, evidenceId)
  return getPublicState(code)
}

export async function advancePhaseAction(code: string): Promise<PublicGameState | null> {
  advancePhase(code)
  return getPublicState(code)
}

export async function saveNotesAction(code: string, notes: string): Promise<void> {
  saveNotes(code, notes)
}

export async function submitAccusationAction(
  code: string,
  payload: { suspectId: string; keyEvidenceIds: string[]; motive: string }
): Promise<PublicGameState | null> {
  submitAccusation(code, payload)
  return getPublicState(code)
}

export async function resetAccusationAction(code: string): Promise<PublicGameState | null> {
  resetAccusation(code)
  return getPublicState(code)
}
