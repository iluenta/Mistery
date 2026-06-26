'use client'

import { useState, useTransition } from 'react'
import { resetAccusationAction, submitAccusationAction } from '@/lib/actions'
import type { PublicGameState } from '@/lib/game'

export default function AccusationView({
  code,
  state,
  onResolved,
}: {
  code: string
  state: PublicGameState
  onResolved: (next: PublicGameState) => void
}) {
  const [suspectId, setSuspectId] = useState('')
  const [keyEvidenceId, setKeyEvidenceId] = useState('')
  const [motive, setMotive] = useState('')
  const [isPending, startTransition] = useTransition()

  if (state.accusation) {
    const { correct, explanation, guiltySuspectName } = state.accusation

    function handleRetry() {
      startTransition(async () => {
        const next = await resetAccusationAction(code)
        if (next) onResolved(next)
      })
    }

    return (
      <div className="space-y-5">
        <div
          className={`case-paper rounded-lg p-6 border-l-4 ${
            correct ? 'border-l-emerald-500' : 'border-l-red-500'
          }`}
        >
          <h2 className="font-medium text-lg">
            {correct ? 'Caso resuelto correctamente.' : 'La acusación no es correcta.'}
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            La persona responsable era{' '}
            <span className="text-neutral-200 font-medium">{guiltySuspectName}</span>.
          </p>
        </div>

        {!correct && (
          <button
            onClick={handleRetry}
            disabled={isPending}
            className="border border-neutral-600 hover:border-amber-600 hover:text-amber-500 disabled:opacity-50 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {isPending ? 'Reabriendo expediente…' : 'Volver a intentarlo'}
          </button>
        )}

        {correct && (
          <section className="case-paper rounded-lg p-6">
            <h3 className="text-sm uppercase tracking-wide text-neutral-500 mb-3">
              Epílogo del caso
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line">
              {explanation}
            </p>
          </section>
        )}
      </div>
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!suspectId || !keyEvidenceId) return
    startTransition(async () => {
      const next = await submitAccusationAction(code, { suspectId, keyEvidenceId, motive })
      if (next) onResolved(next)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="case-paper rounded-lg p-4 text-sm text-amber-500/90">
        Esta es la acusación final. Una vez enviada, no podrás cambiarla.
      </div>

      <div>
        <h2 className="text-sm uppercase tracking-wide text-neutral-500 mb-3">
          ¿Quién es el responsable?
        </h2>
        <div className="space-y-2">
          {state.suspects.map((s) => (
            <label
              key={s.id}
              className={`flex items-center gap-3 case-paper rounded-lg p-3 cursor-pointer transition-colors ${
                suspectId === s.id ? 'border-amber-600' : ''
              }`}
            >
              <input
                type="radio"
                name="suspect"
                value={s.id}
                checked={suspectId === s.id}
                onChange={() => setSuspectId(s.id)}
                className="accent-amber-600"
              />
              <span>
                <span className="font-medium">{s.name}</span>{' '}
                <span className="text-neutral-500 text-sm">— {s.relation}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm uppercase tracking-wide text-neutral-500 mb-3">
          ¿Cuál es la prueba decisiva?
        </h2>
        <select
          value={keyEvidenceId}
          onChange={(e) => setKeyEvidenceId(e.target.value)}
          className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-amber-600"
        >
          <option value="">Selecciona una prueba…</option>
          {state.unlockedEvidence.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h2 className="text-sm uppercase tracking-wide text-neutral-500 mb-3">
          Explica tu razonamiento (opcional)
        </h2>
        <textarea
          value={motive}
          onChange={(e) => setMotive(e.target.value)}
          rows={4}
          placeholder="Motivo, oportunidad y cómo descartaste al resto…"
          className="w-full case-paper rounded-lg p-4 text-sm text-neutral-200 leading-relaxed focus:outline-none focus:border-amber-600 resize-y"
        />
      </div>

      <button
        type="submit"
        disabled={!suspectId || !keyEvidenceId || isPending}
        className="bg-red-700 hover:bg-red-600 disabled:opacity-40 text-white font-medium px-5 py-2.5 rounded-md transition-colors"
      >
        {isPending ? 'Presentando acusación…' : 'Presentar acusación final'}
      </button>
    </form>
  )
}
