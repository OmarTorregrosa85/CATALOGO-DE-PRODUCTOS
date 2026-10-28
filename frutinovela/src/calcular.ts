import { getAudioDurationInSeconds, getVideoMetadata } from "@remotion/media-utils";
import { CalculateMetadataFunction, getStaticFiles, StaticFile } from "remotion";
import {
  Acto,
  actoDeEscena,
  ACTO_SEG,
  CIERRE_SEG,
  ENTRADA_VOZ_SEG,
  Escena,
  ESCENA_DRAMATICA,
  FPS,
  GUION,
  INTRO_SEG,
  MINIMO_SEG,
  OBJETIVO_SEG,
  pad2,
  RESPIRO_SEG,
  T_FADE,
  T_FLASH,
  T_SLIDE,
} from "./config";

export type Clip = {
  src: string;
  nombre: string;
  tipo: "video" | "imagen";
  /** Duración del clip de video en frames (para hacer loop si es más corto). */
  frames: number;
};

export type EscenaResuelta = Escena & {
  acto: number;
  clips: Clip[];
  voz: string | null;
  /** Ruta del efecto de sonido si el archivo existe en /public/sfx */
  sfxSrc: string | null;
  /** Duración de la voz en frames (real o estimada si falta el MP3). */
  vozFrames: number;
  /** Frame (dentro de la escena) en el que arranca la voz. */
  vozInicio: number;
  /** Duración total de la escena en frames. */
  duracion: number;
  faltantes: string[];
};

export type Musica = { src: string; frames: number };

export type FrutinovelaProps = {
  escenas: EscenaResuelta[];
  musica: Musica | null;
};

export type Segmento =
  | { tipo: "intro"; duracion: number }
  | { tipo: "acto"; acto: Acto; duracion: number }
  | { tipo: "escena"; escena: EscenaResuelta; duracion: number }
  | { tipo: "cierre"; duracion: number };

export type Transicion = "fade" | "slide" | "flash";

export type Linea = {
  segmentos: Segmento[];
  /** transiciones[i] va entre segmentos[i] y segmentos[i + 1] */
  transiciones: Transicion[];
  /** Frame absoluto en el que empieza cada segmento */
  inicios: number[];
  total: number;
};

const segAFrames = (s: number) => Math.round(s * FPS);

export const framesDeTransicion = (t: Transicion) =>
  t === "fade" ? T_FADE : t === "slide" ? T_SLIDE : T_FLASH;

/** Arma la línea de tiempo completa: intro, rótulos de acto, escenas y cierre. */
export const construirLinea = (escenas: EscenaResuelta[]): Linea => {
  const segmentos: Segmento[] = [{ tipo: "intro", duracion: segAFrames(INTRO_SEG) }];
  for (const escena of escenas) {
    const acto = GUION.actos.find((a) => a.desdeEscena === escena.id);
    if (acto) segmentos.push({ tipo: "acto", acto, duracion: segAFrames(ACTO_SEG) });
    segmentos.push({ tipo: "escena", escena, duracion: escena.duracion });
  }
  segmentos.push({ tipo: "cierre", duracion: segAFrames(CIERRE_SEG) });

  const transiciones: Transicion[] = [];
  for (let i = 0; i < segmentos.length - 1; i++) {
    const a = segmentos[i];
    const b = segmentos[i + 1];
    if (a.tipo === "acto" || b.tipo === "acto") transiciones.push("slide");
    else if (b.tipo === "escena" && b.escena.id === ESCENA_DRAMATICA) transiciones.push("flash");
    else transiciones.push("fade");
  }

  const inicios: number[] = [];
  let cursor = 0;
  segmentos.forEach((s, i) => {
    inicios.push(cursor);
    cursor += s.duracion - (i < transiciones.length ? framesDeTransicion(transiciones[i]) : 0);
  });

  return { segmentos, transiciones, inicios, total: cursor };
};

// ---------------------------------------------------------------------------
// Descubrimiento de archivos en /public
// ---------------------------------------------------------------------------

const EXT_VIDEO = ["mp4", "webm", "mov", "m4v"];
const EXT_IMAGEN = ["png", "jpg", "jpeg", "webp"];

const archivosPublicos = (): StaticFile[] =>
  getStaticFiles().map((f) => ({ ...f, name: f.name.replace(/\\/g, "/") }));

const buscar = (archivos: StaticFile[], nombre: string) =>
  archivos.find((f) => f.name.toLowerCase() === nombre.toLowerCase()) ?? null;

/** Encuentra escena01.mp4, escena01a.mp4, escena01b.png… (video tiene prioridad sobre imagen). */
const buscarClips = (archivos: StaticFile[], id: number) => {
  const re = new RegExp(`^clips/escena${pad2(id)}([a-z]?)\\.([a-z0-9]+)$`, "i");
  const porParte = new Map<string, { f: StaticFile; tipo: Clip["tipo"] }>();
  for (const f of archivos) {
    const m = f.name.match(re);
    if (!m) continue;
    const parte = m[1].toLowerCase();
    const ext = m[2].toLowerCase();
    const tipo = EXT_VIDEO.includes(ext) ? "video" : EXT_IMAGEN.includes(ext) ? "imagen" : null;
    if (!tipo) continue;
    const previo = porParte.get(parte);
    if (!previo || (previo.tipo === "imagen" && tipo === "video")) porParte.set(parte, { f, tipo });
  }
  return [...porParte.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v);
};

/** Si falta el MP3, estima cuánto duraría la frase (~2.6 palabras/seg) para que todo siga funcionando. */
const estimarVozSeg = (texto: string) => {
  const palabras = texto.split(/\s+/).filter(Boolean).length;
  const pausas = (texto.match(/[….,!?]/g) ?? []).length * 0.15;
  return Math.max(2, palabras / 2.6 + pausas);
};

const resolverEscena = async (
  escena: Escena,
  archivos: StaticFile[],
): Promise<Omit<EscenaResuelta, "duracion" | "vozInicio">> => {
  const faltantes: string[] = [];

  const clips: Clip[] = [];
  for (const { f, tipo } of buscarClips(archivos, escena.id)) {
    if (tipo === "imagen") {
      clips.push({ src: f.src, nombre: f.name, tipo, frames: 0 });
      continue;
    }
    try {
      const meta = await getVideoMetadata(f.src);
      clips.push({ src: f.src, nombre: f.name, tipo, frames: Math.max(1, Math.floor(meta.durationInSeconds * FPS)) });
    } catch (e) {
      console.warn(`No se pudo leer ${f.name}, se omite:`, e);
      faltantes.push(`${f.name} (dañado)`);
    }
  }
  if (clips.length === 0) faltantes.push(`clips/escena${pad2(escena.id)}.mp4`);

  let voz: string | null = null;
  let vozSeg = estimarVozSeg(escena.texto);
  const archivoVoz = buscar(archivos, `voces/escena${pad2(escena.id)}.mp3`);
  if (archivoVoz) {
    try {
      vozSeg = await getAudioDurationInSeconds(archivoVoz.src);
      voz = archivoVoz.src;
    } catch (e) {
      console.warn(`No se pudo leer ${archivoVoz.name}:`, e);
      faltantes.push(`${archivoVoz.name} (dañado)`);
    }
  } else {
    faltantes.push(`voces/escena${pad2(escena.id)}.mp3`);
  }

  const archivoSfx = escena.sfx ? buscar(archivos, `sfx/${escena.sfx}`) : null;

  return {
    ...escena,
    acto: actoDeEscena(escena.id).numero,
    clips,
    voz,
    sfxSrc: archivoSfx?.src ?? null,
    vozFrames: Math.ceil(vozSeg * FPS),
    faltantes,
  };
};

/**
 * Duración de cada escena = voz + 1.5 s de respiro.
 * Si el total queda por debajo de 8:10, se alargan los respiros (por igual) hasta llegar.
 */
export const calcularEscenas = (
  base: Omit<EscenaResuelta, "duracion" | "vozInicio">[],
): EscenaResuelta[] => {
  const respiro = segAFrames(RESPIRO_SEG);
  const entrada = segAFrames(ENTRADA_VOZ_SEG);
  const armar = (extra: number): EscenaResuelta[] =>
    base.map((e) => ({
      ...e,
      duracion: e.vozFrames + respiro + extra,
      // Un cuarto del respiro extra va antes de la voz y el resto después.
      vozInicio: entrada + Math.round(extra / 4),
    }));

  const sinExtra = armar(0);
  const objetivo = segAFrames(OBJETIVO_SEG);
  const totalBase = construirLinea(sinExtra).total;
  if (totalBase >= objetivo) return sinExtra;

  const extra = Math.ceil((objetivo - totalBase) / base.length);
  return armar(extra);
};

export const calcularMetadata: CalculateMetadataFunction<FrutinovelaProps> = async () => {
  const archivos = archivosPublicos();

  const base = await Promise.all(GUION.escenas.map((e) => resolverEscena(e, archivos)));
  const escenas = calcularEscenas(base);

  let musica: Musica | null = null;
  const archivoMusica = buscar(archivos, "musica/fondo.mp3");
  if (archivoMusica) {
    try {
      const seg = await getAudioDurationInSeconds(archivoMusica.src);
      musica = { src: archivoMusica.src, frames: Math.max(1, Math.floor(seg * FPS)) };
    } catch (e) {
      console.warn("No se pudo leer musica/fondo.mp3:", e);
    }
  }

  const linea = construirLinea(escenas);
  const { total } = linea;
  const reloj = (frames: number) => `${Math.floor(frames / FPS / 60)}:${pad2(Math.floor((frames / FPS) % 60))}`;
  const capitulos = linea.segmentos
    .map((s, i) =>
      s.tipo === "intro"
        ? `${reloj(0)} Intro`
        : s.tipo === "acto"
          ? `${reloj(linea.inicios[i])} Acto ${s.acto.numero}: ${s.acto.titulo}`
          : s.tipo === "cierre"
            ? `${reloj(linea.inicios[i])} Final`
            : null,
    )
    .filter(Boolean);
  const faltan = escenas.flatMap((e) => e.faltantes);
  console.log(
    [
      `[Frutinovela] Duración total: ${reloj(total)} (${total} frames). Mínimo: ${reloj(MINIMO_SEG * FPS)}.`,
      `Capítulos para YouTube:\n${capitulos.join("\n")}`,
      `Inicio de cada escena (frame): ${escenas.map((e) => `${e.id}=${linea.inicios[linea.segmentos.findIndex((s) => s.tipo === "escena" && s.escena.id === e.id)]}`).join(" ")}`,
      `Archivos faltantes: ${faltan.length ? faltan.join(", ") : "ninguno"}`,
    ].join("\n"),
  );

  return {
    durationInFrames: total,
    props: { escenas, musica },
  };
};
