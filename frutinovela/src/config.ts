import guion from "./guion.json";

export const FPS = 30;
export const ANCHO = 1920;
export const ALTO = 1080;

// Duraciones fijas (en segundos)
export const INTRO_SEG = 5;
export const ACTO_SEG = 3;
export const CIERRE_SEG = 10;
export const RESPIRO_SEG = 1.5;

// Duración mínima para habilitar anuncios a mitad del video: 8:10.
// Se apunta 1 s por encima para que el redondeo de YouTube no lo deje corto.
export const MINIMO_SEG = 8 * 60 + 10;
export const OBJETIVO_SEG = MINIMO_SEG + 1;

// Duración de las transiciones (en frames)
export const T_FADE = 15;
export const T_SLIDE = 20;
export const T_FLASH = 24;

// La voz arranca un poco después del inicio de la escena para no pisar la transición.
export const ENTRADA_VOZ_SEG = 0.5;

// Música de fondo
export const VOLUMEN_MUSICA = 0.12;
export const VOLUMEN_MUSICA_CON_VOZ = 0.06;
export const VOLUMEN_SFX = 0.35;

// Escena con zoom dramático + flash blanco
export const ESCENA_DRAMATICA = 18;

export const COLORES_PERSONAJE: Record<string, string> = {
  Lupita: "#FFD60A",
  Ramiro: "#D9A86C",
  Valentina: "#FF8FC8",
  "Don Mango": "#FF9F1C",
  Narrador: "#FFFFFF",
  "Dueña de la casa": "#B57BFF",
};

// Colores de los placeholders por acto
export const COLORES_ACTO: Record<number, [string, string]> = {
  1: ["#1b4965", "#5fa8d3"],
  2: ["#5a189a", "#9d4edd"],
  3: ["#9d0208", "#f48c06"],
  4: ["#283618", "#606c38"],
};

export type Escena = {
  id: number;
  personaje: string;
  texto: string;
  descripcion: string;
  sfx?: string;
};

export type Acto = { numero: number; titulo: string; desdeEscena: number };

export const GUION = guion as { titulo: string; actos: Acto[]; escenas: Escena[] };

export const actoDeEscena = (id: number): Acto =>
  [...GUION.actos].reverse().find((a) => id >= a.desdeEscena) ?? GUION.actos[0];

export const pad2 = (n: number) => String(n).padStart(2, "0");
