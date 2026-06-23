import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'node:fs'
import path from 'node:path'

const DB_DIR = path.join(process.cwd(), 'data')
const DB_PATH = path.join(DB_DIR, 'games.db')

mkdirSync(DB_DIR, { recursive: true })

const globalForDb = globalThis as unknown as { __mysteryDb?: DatabaseSync }

export const db =
  globalForDb.__mysteryDb ??
  (globalForDb.__mysteryDb = new DatabaseSync(DB_PATH))

db.exec(`
  CREATE TABLE IF NOT EXISTS games (
    code TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    current_phase INTEGER NOT NULL DEFAULT 1,
    read_evidence_ids TEXT NOT NULL DEFAULT '[]',
    notes TEXT NOT NULL DEFAULT '',
    accusation TEXT
  )
`)

export interface GameRow {
  code: string
  created_at: string
  updated_at: string
  current_phase: number
  read_evidence_ids: string
  notes: string
  accusation: string | null
}

export function getGameRow(code: string): GameRow | undefined {
  const stmt = db.prepare('SELECT * FROM games WHERE code = ?')
  return stmt.get(code) as GameRow | undefined
}

export function insertGameRow(code: string) {
  const now = new Date().toISOString()
  db.prepare(
    'INSERT INTO games (code, created_at, updated_at, current_phase, read_evidence_ids, notes, accusation) VALUES (?, ?, ?, 1, ?, ?, NULL)'
  ).run(code, now, now, '[]', '')
}

export function updateGameRow(
  code: string,
  fields: Partial<Pick<GameRow, 'current_phase' | 'read_evidence_ids' | 'notes' | 'accusation'>>
) {
  const current = getGameRow(code)
  if (!current) throw new Error('Expediente no encontrado')

  const next = { ...current, ...fields, updated_at: new Date().toISOString() }
  db.prepare(
    `UPDATE games SET updated_at = ?, current_phase = ?, read_evidence_ids = ?, notes = ?, accusation = ? WHERE code = ?`
  ).run(next.updated_at, next.current_phase, next.read_evidence_ids, next.notes, next.accusation, code)
}
