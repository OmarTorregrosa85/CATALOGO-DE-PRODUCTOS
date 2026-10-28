# La Piña que fingía ser millonaria 🍍 — Frutinovela en Remotion

Proyecto de Remotion (TypeScript) que monta el video completo (1920x1080, 30 fps, MP4 H.264)
a partir de clips, voces y música en `public/`. La duración se calcula sola desde los audios
y nunca baja de **8:10** (se alargan los respiros entre escenas si hace falta).

## Comandos

```bash
npm install                                   # una sola vez
npx remotion studio                           # previsualizar en el navegador
npx remotion render Frutinovela out/la-pina-que-fingia-ser-millonaria.mp4
npx remotion still Miniatura out/miniatura.png
npx tsx scripts/generar-voces.ts              # (opcional) voces con ElevenLabs
```

## Qué poner en cada carpeta (`public/`)

| Carpeta | Archivos | Notas |
|---|---|---|
| `clips/` | `escena01.mp4` … `escena24.mp4` | Varios por escena: `escena01a.mp4`, `escena01b.mp4`… Si no hay video, `escena01.png` (efecto Ken Burns). |
| `clips/` | `miniatura.png` | Fondo de la miniatura (1280x720). |
| `voces/` | `escena01.mp3` … `escena24.mp3` | Diálogo/narración. Definen la duración de cada escena. |
| `musica/` | `fondo.mp3` | Música dramática; se repite en loop (0.12, baja a 0.06 con voz). |
| `sfx/` | `golpe.mp3`, `murmullos.mp3`, `fiesta.mp3` | Opcionales; las escenas que los usan están en `src/guion.json` (campo `sfx`). |

Si falta cualquier archivo, esa escena muestra un placeholder de color con su número y
descripción (y la lista de lo que falta, arriba a la derecha), así que el render nunca falla.

## Archivos principales

- `src/guion.json` — actos y las 24 escenas (id, personaje, texto, descripcion, sfx opcional).
- `src/calcular.ts` — `calculateMetadata`: busca los archivos, mide audios/videos y arma la línea de tiempo.
- `src/config.ts` — duraciones, volúmenes, colores de cada personaje.
- `src/Frutinovela.tsx` — composición principal con `TransitionSeries` (fade, slide entre actos, flash en la escena 18).
- `src/Miniatura.tsx` — composición fija 1280x720 para la miniatura.
- `scripts/generar-voces.ts` — genera los MP3 con ElevenLabs (IDs de voz al inicio del archivo).
