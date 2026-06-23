'use client'

import { useState, useTransition } from 'react'
import {
  advancePhaseAction,
  markEvidenceReadAction,
  saveNotesAction,
} from '@/lib/actions'
import type { PublicGameState } from '@/lib/game'
import type { Evidence, EvidenceCategory } from '@/lib/case-data'
import AccusationView from './AccusationView'

type Tab = 'briefing' | 'sospechosos' | 'pruebas' | 'notas' | 'acusacion'

const CATEGORY_LABEL: Record<EvidenceCategory, string> = {
  forense: 'Forense',
  digital: 'Digital',
  financiero: 'Financiero',
  testimonio: 'Testimonio',
  fisico: 'Físico',
}

export default function InvestigationBoard({
  code,
  initialState,
}: {
  code: string
  initialState: PublicGameState
}) {
  const [state, setState] = useState(initialState)
  const [tab, setTab] = useState<Tab>('briefing')
  const [isPending, startTransition] = useTransition()
  const [openEvidenceId, setOpenEvidenceId] = useState<string | null>(null)

  function openEvidence(evidence: Evidence) {
    setOpenEvidenceId((curr) => (curr === evidence.id ? null : evidence.id))
    if (!state.readEvidenceIds.includes(evidence.id)) {
      startTransition(async () => {
        const next = await markEvidenceReadAction(code, evidence.id)
        if (next) setState(next)
      })
    }
  }

  function handleAdvancePhase() {
    startTransition(async () => {
      const next = await advancePhaseAction(code)
      if (next) setState(next)
    })
  }

  const readCount = state.unlockedEvidence.filter((e) =>
    state.readEvidenceIds.includes(e.id)
  ).length

  return (
    <main className="flex-1 flex flex-col">
      <header className="border-b border-neutral-800 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-medium">{state.title}</h1>
          <p className="text-xs text-neutral-500">
            Expediente <span className="font-mono text-amber-500">{code}</span> · Fase{' '}
            {state.currentPhase} de {state.totalPhases} · {readCount}/
            {state.unlockedEvidence.length} pruebas revisadas
          </p>
        </div>
        {state.canAdvancePhase && (
          <button
            onClick={handleAdvancePhase}
            disabled={isPending}
            className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-black text-sm font-medium px-4 py-2 rounded-md transition-colors"
          >
            Avanzar investigación →
          </button>
        )}
      </header>

      <nav className="border-b border-neutral-800 px-6 flex gap-1 overflow-x-auto text-sm">
        {(
          [
            ['briefing', 'Resumen'],
            ['sospechosos', 'Sospechosos'],
            ['pruebas', 'Pruebas'],
            ['notas', 'Notas'],
            ['acusacion', 'Acusación'],
          ] as [Tab, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-3 border-b-2 -mb-px transition-colors whitespace-nowrap ${
              tab === key
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="flex-1 px-6 py-8 max-w-3xl w-full mx-auto">
        {tab === 'briefing' && (
          <div className="space-y-6">
            <section className="case-paper rounded-lg p-6">
              <h2 className="text-sm uppercase tracking-wide text-neutral-500 mb-3">
                La víctima
              </h2>
              <p className="font-medium">
                {state.victim.name}, {state.victim.age} años — {state.victim.occupation}
              </p>
              <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
                {state.victim.description}
              </p>
              <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
                {state.victim.deathSummary}
              </p>
            </section>
            <section className="case-paper rounded-lg p-6">
              <h2 className="text-sm uppercase tracking-wide text-neutral-500 mb-3">
                Briefing del caso
              </h2>
              <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
                {state.briefing}
              </p>
            </section>
          </div>
        )}

        {tab === 'sospechosos' && (
          <div className="space-y-4">
            {state.suspects.map((s) => (
              <div key={s.id} className="case-paper rounded-lg p-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-sm font-medium text-amber-500 shrink-0">
                    {s.initial}
                  </div>
                  <div>
                    <p className="font-medium">
                      {s.name} <span className="text-neutral-500 text-sm">· {s.age} años</span>
                    </p>
                    <p className="text-xs text-neutral-500">{s.relation}</p>
                  </div>
                </div>
                <p className="text-sm text-neutral-300 mt-3 italic">{s.statement}</p>
                <p className="text-sm text-neutral-400 mt-2">
                  <span className="text-neutral-500">Coartada: </span>
                  {s.alibiClaim}
                </p>
                <p className="text-sm text-neutral-400 mt-1">
                  <span className="text-neutral-500">Posible motivo: </span>
                  {s.motiveHint}
                </p>
              </div>
            ))}
          </div>
        )}

        {tab === 'pruebas' && (
          <div className="space-y-3">
            {state.unlockedEvidence.map((evidence) => {
              const isRead = state.readEvidenceIds.includes(evidence.id)
              const isOpen = openEvidenceId === evidence.id
              return (
                <div key={evidence.id} className="case-paper rounded-lg overflow-hidden">
                  <button
                    onClick={() => openEvidence(evidence)}
                    className="w-full text-left p-4 flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wide text-amber-500/80 border border-amber-700/40 rounded px-1.5 py-0.5">
                          {CATEGORY_LABEL[evidence.category]}
                        </span>
                        {!isRead && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        )}
                      </div>
                      <p className="font-medium mt-1.5">{evidence.title}</p>
                      <p className="text-sm text-neutral-500">{evidence.summary}</p>
                    </div>
                    <span className="text-neutral-500 text-sm">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-sm text-neutral-300 leading-relaxed whitespace-pre-line border-t border-neutral-800 pt-3">
                      {evidence.content}
                    </div>
                  )}
                </div>
              )
            })}
            {!state.canAdvancePhase && state.currentPhase < state.totalPhases && (
              <p className="text-xs text-neutral-500 pt-2">
                Revisa todas las pruebas de esta fase para desbloquear la siguiente.
              </p>
            )}
          </div>
        )}

        {tab === 'notas' && <NotesPanel code={code} initialNotes={state.notes} />}

        {tab === 'acusacion' && (
          <AccusationView code={code} state={state} onResolved={setState} />
        )}
      </div>
    </main>
  )
}

function NotesPanel({ code, initialNotes }: { code: string; initialNotes: string }) {
  const [notes, setNotes] = useState(initialNotes)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  function handleBlur() {
    setStatus('saving')
    saveNotesAction(code, notes).then(() => setStatus('saved'))
  }

  return (
    <div className="space-y-2">
      <h2 className="text-sm uppercase tracking-wide text-neutral-500">
        Tus notas de investigación
      </h2>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onBlur={handleBlur}
        rows={16}
        placeholder="Anota tus hipótesis, contradicciones entre coartadas y cabos sueltos…"
        className="w-full case-paper rounded-lg p-4 text-sm text-neutral-200 leading-relaxed focus:outline-none focus:border-amber-600 resize-y"
      />
      <p className="text-xs text-neutral-500">
        {status === 'saving' && 'Guardando…'}
        {status === 'saved' && 'Notas guardadas.'}
        {status === 'idle' && 'Se guardan automáticamente al salir del cuadro de texto.'}
      </p>
    </div>
  )
}
