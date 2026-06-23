'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createGameAction } from '@/lib/actions'
import { CASE } from '@/lib/case-data'

export default function HomePage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [continueCode, setContinueCode] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleNewCase() {
    setError(null)
    startTransition(async () => {
      const { code } = await createGameAction()
      router.push(`/caso/${code}`)
    })
  }

  function handleContinue(e: React.FormEvent) {
    e.preventDefault()
    const code = continueCode.trim().toUpperCase()
    if (code.length < 4) {
      setError('Introduce el código de expediente completo.')
      return
    }
    router.push(`/caso/${code}`)
  }

  return (
    <main className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="max-w-2xl w-full space-y-8">
        <div className="space-y-3">
          <p className="text-amber-500/80 text-sm tracking-widest uppercase">
            Investigación para 1 o 2 jugadores
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            {CASE.title}
          </h1>
          <p className="text-neutral-400 leading-relaxed">{CASE.tagline}</p>
        </div>

        <div className="case-paper rounded-lg p-6 space-y-4">
          <h2 className="font-medium text-neutral-200">Empezar</h2>
          <p className="text-sm text-neutral-400">
            Se generará un código de expediente único. Guárdalo para poder continuar la
            investigación más tarde, desde este o cualquier otro dispositivo.
          </p>
          <button
            onClick={handleNewCase}
            disabled={isPending}
            className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-black font-medium px-5 py-2.5 rounded-md transition-colors"
          >
            {isPending ? 'Abriendo expediente…' : 'Abrir un caso nuevo'}
          </button>
        </div>

        <div className="case-paper rounded-lg p-6 space-y-4">
          <h2 className="font-medium text-neutral-200">Continuar una investigación</h2>
          <form onSubmit={handleContinue} className="flex flex-col sm:flex-row gap-3">
            <input
              value={continueCode}
              onChange={(e) => setContinueCode(e.target.value)}
              placeholder="Código de expediente, p. ej. K7QXM2"
              className="flex-1 bg-neutral-900 border border-neutral-700 rounded-md px-4 py-2.5 text-sm tracking-widest uppercase placeholder:tracking-normal placeholder:normal-case focus:outline-none focus:border-amber-600"
              maxLength={8}
            />
            <button
              type="submit"
              className="border border-neutral-600 hover:border-amber-600 hover:text-amber-500 px-5 py-2.5 rounded-md transition-colors text-sm font-medium"
            >
              Continuar
            </button>
          </form>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>
      </div>
    </main>
  )
}
