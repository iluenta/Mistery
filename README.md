# Expediente Vidal: La Última Story

Juego de misterio para resolver en solitario o en pareja. Investigas la muerte de
Helena Vidal revisando pruebas, leyendo las declaraciones de cinco sospechosos y
presentando una acusación final razonada.

## Cómo jugar

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000), pulsa **"Abrir un caso nuevo"** y
guarda el código de expediente que se genera: te permite continuar la investigación
más adelante desde `/caso/<código>`.

## Cómo está hecho

- **Next.js (App Router) + TypeScript + Tailwind.**
- El guion completo del caso (víctima, sospechosos, pruebas y solución) vive en
  `src/lib/case-data.ts`.
- La lógica de partida (desbloqueo de pruebas por fases, notas, acusación final)
  está en `src/lib/game.ts` y se expone a los componentes cliente como
  [Server Actions](src/lib/actions.ts).
- El progreso se guarda en una base SQLite local (`data/games.db`, ignorada por
  git) usando el módulo nativo `node:sqlite` de Node 22 — sin dependencias
  externas de base de datos.

> Nota: al ser un fichero SQLite en disco, el guardado de partidas solo persiste
> mientras la app corra sobre un mismo sistema de archivos. Para desplegar en una
> plataforma serverless (Vercel, etc.) con persistencia real entre despliegues,
> habría que sustituir `src/lib/db.ts` por una base de datos remota.
