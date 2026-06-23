import Link from 'next/link'
import { getPublicState } from '@/lib/game'
import InvestigationBoard from '@/components/InvestigationBoard'

export default async function CasoPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code: rawCode } = await params
  const code = rawCode.toUpperCase()
  const state = getPublicState(code)

  if (!state) {
    return (
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-md w-full text-center space-y-4">
          <h1 className="text-xl font-medium">Expediente no encontrado</h1>
          <p className="text-neutral-400 text-sm">
            El código <span className="font-mono">{code}</span> no corresponde a ninguna
            investigación abierta. Revisa que lo hayas copiado bien.
          </p>
          <Link
            href="/"
            className="inline-block border border-neutral-600 hover:border-amber-600 hover:text-amber-500 px-4 py-2 rounded-md text-sm transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </main>
    )
  }

  return <InvestigationBoard code={code} initialState={state} />
}
