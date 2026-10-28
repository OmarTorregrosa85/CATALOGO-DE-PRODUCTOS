/**
 * Genera public/voces/escena01.mp3 … escena24.mp3 desde src/guion.json con la API de ElevenLabs.
 *
 * Uso:
 *   npx tsx scripts/generar-voces.ts              → genera solo las voces que falten
 *   npx tsx scripts/generar-voces.ts --forzar     → regenera todas
 *   npx tsx scripts/generar-voces.ts --escena 5   → solo la escena 5 (se puede repetir: --escena 5 --escena 9)
 *
 * Necesita ELEVENLABS_API_KEY en el archivo .env (ver .env.example).
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import guion from "../src/guion.json";

// Cambia estos IDs por las voces que elijas en https://elevenlabs.io/app/voice-library
// (en la voz: "⋯" → "Copy voice ID").
const VOCES: Record<string, string> = {
  Narrador: "pNInz6obpgDQGcFmaJgB",
  Lupita: "MF3mGyEYCl7XYWbV9V5O",
  Ramiro: "TxGEqnHWrfWFTfGW9XjX",
  Valentina: "AZnzlk1XvdvUeBnXmlld",
  "Don Mango": "VR6AewLTigWG4xSOukaG",
  "Dueña de la casa": "EXAVITQu4vr4xnSDxMaL",
};

const MODELO = "eleven_multilingual_v2";
const AJUSTES_VOZ = { stability: 0.4, similarity_boost: 0.8, style: 0.45, use_speaker_boost: true };

const CARPETA = join(__dirname, "..", "public", "voces");

const args = process.argv.slice(2);
const forzar = args.includes("--forzar");
const soloEscenas = args.flatMap((a, i) => (a === "--escena" ? [Number(args[i + 1])] : []));

try {
  process.loadEnvFile(join(__dirname, "..", ".env"));
} catch {
  // Sin .env: se usa la variable de entorno si ya existe.
}
const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error("Falta ELEVENLABS_API_KEY. Copia .env.example a .env y pega tu clave.");
  process.exit(1);
}

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));

const generar = async (vozId: string, texto: string): Promise<Buffer> => {
  for (let intento = 1; ; intento++) {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${vozId}?output_format=mp3_44100_128`, {
      method: "POST",
      headers: { "xi-api-key": API_KEY, "Content-Type": "application/json", Accept: "audio/mpeg" },
      body: JSON.stringify({ text: texto, model_id: MODELO, voice_settings: AJUSTES_VOZ }),
    });
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    if ((res.status === 429 || res.status >= 500) && intento < 4) {
      console.warn(`  ElevenLabs respondió ${res.status}, reintentando en ${intento * 5}s…`);
      await esperar(intento * 5000);
      continue;
    }
    throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
  }
};

const main = async () => {
  mkdirSync(CARPETA, { recursive: true });
  let hechas = 0;

  for (const escena of guion.escenas) {
    if (soloEscenas.length && !soloEscenas.includes(escena.id)) continue;
    const archivo = join(CARPETA, `escena${String(escena.id).padStart(2, "0")}.mp3`);
    if (existsSync(archivo) && !forzar && !soloEscenas.length) {
      console.log(`✓ Escena ${escena.id} ya existe, se omite (usa --forzar para regenerar)`);
      continue;
    }
    const vozId = VOCES[escena.personaje];
    if (!vozId) throw new Error(`No hay voz configurada para "${escena.personaje}" en VOCES`);

    console.log(`→ Escena ${escena.id} (${escena.personaje}): ${escena.texto}`);
    writeFileSync(archivo, await generar(vozId, escena.texto));
    hechas++;
  }
  console.log(`\nListo: ${hechas} voces generadas en public/voces/`);
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
