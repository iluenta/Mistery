'use client'

import { useState, useTransition } from 'react'
import { resetAccusationAction, submitAccusationAction } from '@/lib/actions'
import type { PublicGameState } from '@/lib/game'

const MIN_EVIDENCE = 2

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
  const [keyEvidenceIds, setKeyEvidenceIds] = useState<string[]>([])
  const [motive, setMotive] = useState('')
  const [isPending, startTransition] = useTransition()

  function toggleEvidence(id: string) {
    setKeyEvidenceIds((curr) =>
      curr.includes(id) ? curr.filter((e) => e !== id) : [...curr, id]
    )
  }

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
          {correct ? (
            <p className="text-sm text-neutral-400 mt-1">
              La persona responsable era{' '}
              <span className="text-neutral-200 font-medium">{guiltySuspectName}</span>.
            </p>
          ) : (
            <p className="text-sm text-neutral-400 mt-1">
              Revisa tanto a quién señalas como las pruebas en las que te apoyas: puede que
              no sean las decisivas, o que te falte alguna. No se revela la solución para
              que puedas seguir investigando.
            </p>
          )}
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
    if (!suspectId || keyEvidenceIds.length < MIN_EVIDENCE) return
    startTransition(async () => {
      const next = await submitAccusationAction(code, {
        suspectId,
        keyEvidenceIds,
        motive,
      })
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
        <h2 className="text-sm uppercase tracking-wide text-neutral-500 mb-1">
          ¿En qué pruebas se sostiene la acusación?
        </h2>
        <p className="text-xs text-neutral-500 mb-3">
          Marca todas las pruebas decisivas que demuestran tu teoría. Una sola no basta:
          necesitas combinar móvil y oportunidad. ({keyEvidenceIds.length} seleccionada
          {keyEvidenceIds.length === 1 ? '' : 's'})
        </p>
        <div className="space-y-2">
          {state.unlockedEvidence.map((e) => {
            const checked = keyEvidenceIds.includes(e.id)
            return (
              <label
                key={e.id}
                className={`flex items-start gap-3 case-paper rounded-lg p-3 cursor-pointer transition-colors ${
                  checked ? 'border-amber-600' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleEvidence(e.id)}
                  className="accent-amber-600 mt-0.5"
                />
                <span>
                  <span className="font-medium text-sm">{e.title}</span>
                  <span className="block text-xs text-neutral-500">{e.summary}</span>
                </span>
              </label>
            )
          })}
        </div>
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
        disabled={!suspectId || keyEvidenceIds.length < MIN_EVIDENCE || isPending}
        className="bg-red-700 hover:bg-red-600 disabled:opacity-40 text-white font-medium px-5 py-2.5 rounded-md transition-colors"
      >
        {isPending ? 'Presentando acusación…' : 'Presentar acusación final'}
      </button>
    </form>
  )
}
