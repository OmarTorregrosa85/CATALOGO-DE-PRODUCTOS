import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import { z } from "zod";

// Fuente redondeada Fredoka (OFL), incluida en public/ para renderizar sin internet
loadFont({
  family: "Fredoka",
  url: staticFile("fonts/Fredoka-latin.woff2"),
  weight: "300 700",
});

export const FONT = "Fredoka, 'Inter', sans-serif";

export const FPS = 30;

// Duración de cada escena (frames a 30 fps) — total 30 s
export const TITLE = 50;
export const HALLWAY = 170;
export const QUESTION = 140;
export const ANSWER = 480;
export const ENDING = 60;
export const TOTAL = TITLE + HALLWAY + QUESTION + ANSWER + ENDING;

export const entrevistaSchema = z.object({
  playerName: z.string(),
  playerNumber: z.number(),
  teamName: z.string(),
  question: z.string(),
  answer: z.array(z.string()),
});

export type EntrevistaProps = z.infer<typeof entrevistaSchema>;

export const PLAYER_LOOK = {
  skin: "#e9b48a",
  skinShade: "#c98a63",
  hair: "#3b2416",
  eyes: "#6b4423",
  shirt: "#2563eb",
  shirtShade: "#1e40af",
};

export const REPORTER_LOOK = {
  skin: "#f3c9a5",
  skinShade: "#d9a07c",
  hair: "#b4532a",
  eyes: "#2f7d5b",
  shirt: "#9333ea",
  shirtShade: "#6b21a8",
};

// Parpadeo periódico (0 abierto, 1 cerrado)
export const blinkAt = (f: number, seed: number) => {
  const c = (f + seed) % 97;
  return c < 6 ? Math.sin((c / 6) * Math.PI) : 0;
};

// Apertura de boca al hablar
export const talkMouth = (f: number) =>
  Math.min(1, 0.12 + 0.88 * Math.abs(Math.sin(f * 0.62)) * (0.65 + 0.35 * Math.sin(f * 0.21)));

// Duración de cada frase según su longitud
export const lineDuration = (text: string) => Math.round(text.length * 1.6 + 16);
