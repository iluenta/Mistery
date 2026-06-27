'use client'

import { useState, useTransition } from 'react'
import {
  advancePhaseAction,
  markEvidenceReadAction,
  saveNotesAction,
} from '@/lib/actions'
import type { PublicGameState } from '@/lib/game'
import type { Evidence, EvidenceCategory, Suspect } from '@/lib/case-data'
import AccusationView from './AccusationView'

type Tab = 'briefing' | 'sospechosos' | 'pruebas' | 'cronologia' | 'notas' | 'acusacion'

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
  const [showHints, setShowHints] = useState(false)

  function markRead(evidenceId: string) {
    if (!state.readEvidenceIds.includes(evidenceId)) {
      startTransition(async () => {
        const next = await markEvidenceReadAction(code, evidenceId)
        if (next) setState(next)
      })
    }
  }

  function openEvidence(evidence: Evidence) {
    setOpenEvidenceId((curr) => (curr === evidence.id ? null : evidence.id))
    markRead(evidence.id)
  }

  function jumpToEvidence(evidenceId: string) {
    setTab('pruebas')
    setOpenEvidenceId(evidenceId)
    markRead(evidenceId)
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
  const remaining = state.unlockedEvidence.length - readCount

  return (
    <main className="flex-1 flex flex-col">
      <header className="border-b border-neutral-800 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="font-medium">{state.title}</h1>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: state.totalPhases }, (_, i) => i + 1).map((phase) => (
              <span
                key={phase}
                title={`Fase ${phase}`}
                className={`w-2.5 h-2.5 rounded-full ${
                  phase < state.currentPhase
                    ? 'bg-amber-600'
                    : phase === state.currentPhase
                      ? 'bg-amber-500 ring-2 ring-amber-500/30'
                      : 'bg-neutral-700'
                }`}
              />
            ))}
          </div>
        </div>
        <p className="text-xs text-neutral-500">
          Expediente <span className="font-mono text-amber-500">{code}</span> · Fase{' '}
          {state.currentPhase} de {state.totalPhases} · {readCount}/
          {state.unlockedEvidence.length} pruebas revisadas
        </p>
      </header>

      {state.canAdvancePhase && (
        <div className="bg-amber-600 text-black px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium">
            Has revisado todas las pruebas de la Fase {state.currentPhase}. Hay más
            información esperando.
          </p>
          <button
            onClick={handleAdvancePhase}
            disabled={isPending}
            className="bg-black/90 hover:bg-black disabled:opacity-50 text-amber-400 text-sm font-medium px-4 py-2 rounded-md transition-colors whitespace-nowrap"
          >
            {isPending ? 'Avanzando…' : 'Avanzar investigación →'}
          </button>
        </div>
      )}
      {!state.canAdvancePhase && state.currentPhase < state.totalPhases && remaining > 0 && (
        <div className="bg-neutral-900 border-b border-neutral-800 px-6 py-2.5">
          <p className="text-xs text-neutral-400">
            Te quedan <span className="text-amber-500 font-medium">{remaining}</span>{' '}
            {remaining === 1 ? 'prueba' : 'pruebas'} por abrir en la pestaña{' '}
            <button onClick={() => setTab('pruebas')} className="underline hover:text-amber-500">
              Pruebas
            </button>{' '}
            para desbloquear la Fase {state.currentPhase + 1}.
          </p>
        </div>
      )}

      {state.hints.length > 0 && (
        <div className="border-b border-neutral-800 px-6 py-2">
          <button
            onClick={() => setShowHints((v) => !v)}
            className="text-xs text-neutral-500 hover:text-amber-500 transition-colors"
          >
            {showHints
              ? '▾ Ocultar pistas de investigación'
              : '▸ ¿Atascado? Ver pistas de investigación'}
          </button>
          {showHints && (
            <div className="mt-2 space-y-2">
              {state.hints.map((hint, i) => (
                <div key={i} className="case-paper rounded-lg p-3">
                  <p className="text-xs text-amber-500/80 mb-1">Pista · Fase {i + 1}</p>
                  <p className="text-sm text-neutral-300 leading-relaxed">{hint}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <nav className="border-b border-neutral-800 px-6 flex gap-1 overflow-x-auto text-sm">
        {(
          [
            ['briefing', 'Resumen'],
            ['sospechosos', 'Sospechosos'],
            ['pruebas', 'Pruebas'],
            ['cronologia', 'Cronología'],
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
              <SuspectCard
                key={s.id}
                suspect={s}
                unlockedEvidence={state.unlockedEvidence}
                onJump={jumpToEvidence}
              />
            ))}
          </div>
        )}

        {tab === 'pruebas' && (
          <div className="space-y-3">
            <p className="text-sm text-neutral-400">
              Fase {state.currentPhase} de {state.totalPhases} · has revisado {readCount} de{' '}
              {state.unlockedEvidence.length} pruebas disponibles hasta ahora.
            </p>
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
                    <div className="px-4 pb-4 border-t border-neutral-800 pt-3">
                      <div className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
                        {evidence.content}
                      </div>
                      {evidence.relatedSuspectIds.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-neutral-800 flex flex-wrap items-center gap-1.5">
                          <span className="text-xs text-neutral-500">Relacionada con:</span>
                          {evidence.relatedSuspectIds.map((sid) => {
                            const sus = state.suspects.find((s) => s.id === sid)
                            if (!sus) return null
                            return (
                              <button
                                key={sid}
                                onClick={() => setTab('sospechosos')}
                                className="text-xs border border-neutral-700 hover:border-amber-600 hover:text-amber-500 rounded px-2 py-1 transition-colors"
                              >
                                {sus.name}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
            {state.canAdvancePhase && (
              <button
                onClick={handleAdvancePhase}
                disabled={isPending}
                className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-black font-medium px-5 py-3 rounded-lg transition-colors mt-2"
              >
                {isPending ? 'Avanzando…' : `Avanzar a la Fase ${state.currentPhase + 1} →`}
              </button>
            )}
          </div>
        )}

        {tab === 'cronologia' && (
          <div className="space-y-4">
            <p className="text-sm text-neutral-400">
              Línea temporal de la noche del crimen. Se va completando a medida que avanzas
              en la investigación.
            </p>
            <div className="space-y-2">
              {state.timeline.map((ev, i) => (
                <div
                  key={i}
                  className="case-paper rounded-lg p-3 flex gap-3 items-baseline"
                >
                  <span className="font-mono text-amber-500 text-sm shrink-0 w-12">
                    {ev.time}
                  </span>
                  <span className="text-sm text-neutral-300 leading-relaxed">{ev.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'notas' && <NotesPanel code={code} initialNotes={state.notes} />}

        {tab === 'acusacion' && (
          <div className="space-y-5">
            {!state.accusation && state.currentPhase < state.totalPhases && (
              <div className="case-paper rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-neutral-400">
                  Estás en la Fase {state.currentPhase} de {state.totalPhases}: aún hay
                  pruebas sin descubrir. Puedes acusar ya, pero te faltarán algunas de las
                  pruebas decisivas en la lista.
                </p>
                <button
                  onClick={() => setTab('pruebas')}
                  className="border border-neutral-600 hover:border-amber-600 hover:text-amber-500 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Seguir investigando
                </button>
              </div>
            )}
            <AccusationView code={code} state={state} onResolved={setState} />
          </div>
        )}
      </div>
    </main>
  )
}

function SuspectCard({
  suspect,
  unlockedEvidence,
  onJump,
}: {
  suspect: Suspect
  unlockedEvidence: Evidence[]
  onJump: (id: string) => void
}) {
  const [confrontId, setConfrontId] = useState('')
  const related = unlockedEvidence.filter((e) =>
    e.relatedSuspectIds.includes(suspect.id)
  )
  const response = suspect.responses.find((r) => r.evidenceId === confrontId)
  const confronted = unlockedEvidence.find((e) => e.id === confrontId)
  const firstName = suspect.name.split(' ')[0]

  return (
    <div className="case-paper rounded-lg p-5">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-sm font-medium text-amber-500 shrink-0">
          {suspect.initial}
        </div>
        <div>
          <p className="font-medium">
            {suspect.name}{' '}
            <span className="text-neutral-500 text-sm">· {suspect.age} años</span>
          </p>
          <p className="text-xs text-neutral-500">{suspect.relation}</p>
        </div>
      </div>
      <p className="text-sm text-neutral-300 mt-3 italic">{suspect.statement}</p>
      <p className="text-sm text-neutral-400 mt-2">
        <span className="text-neutral-500">Coartada: </span>
        {suspect.alibiClaim}
      </p>
      <p className="text-sm text-neutral-400 mt-1">
        <span className="text-neutral-500">Posible motivo: </span>
        {suspect.motiveHint}
      </p>

      {related.length > 0 && (
        <div className="mt-3 pt-3 border-t border-neutral-800">
          <p className="text-xs text-neutral-500 mb-1.5">
            Pruebas del expediente que la mencionan
          </p>
          <div className="flex flex-wrap gap-1.5">
            {related.map((e) => (
              <button
                key={e.id}
                onClick={() => onJump(e.id)}
                className="text-xs border border-neutral-700 hover:border-amber-600 hover:text-amber-500 rounded px-2 py-1 transition-colors"
              >
                {e.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-neutral-800">
        <p className="text-xs text-neutral-500 mb-1.5">Confrontar con una prueba</p>
        <select
          value={confrontId}
          onChange={(e) => setConfrontId(e.target.value)}
          className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-amber-600"
        >
          <option value="">Elige una prueba para confrontar…</option>
          {unlockedEvidence.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title}
            </option>
          ))}
        </select>
        {confrontId && (
          <div className="mt-2 bg-neutral-900/60 border border-neutral-800 rounded-md p-3">
            {response ? (
              <p className="text-sm text-neutral-300 italic leading-relaxed whitespace-pre-line">
                {response.reaction}
              </p>
            ) : (
              <p className="text-sm text-neutral-500 italic">
                {firstName} se encoge de hombros: no parece tener nada que añadir sobre
                «{confronted?.title}».
              </p>
            )}
          </div>
        )}
      </div>
    </div>
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
