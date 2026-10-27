import { z } from "zod";

export const FPS = 30;

// Duración de cada escena (en frames, a 30 fps)
export const INTRO = 120;
export const FREE_KICK = 165;
export const GOAL = 165;
export const CHAMPIONS = 240;
export const TOTAL = INTRO + FREE_KICK + GOAL + CHAMPIONS;

export const FONT =
  "Impact, 'Arial Black', 'Inter Display', Inter, 'Helvetica Neue', Arial, sans-serif";

export const golazoSchema = z.object({
  playerName: z.string(),
  playerNumber: z.number(),
  homeTeam: z.string(),
  awayTeam: z.string(),
});

export type GolazoProps = z.infer<typeof golazoSchema>;

export const HOME = {
  shirt: "#d62828",
  shorts: "#ffffff",
  socks: "#d62828",
};

export const AWAY = {
  shirt: "#1d4ed8",
  shorts: "#0b1d4d",
  socks: "#ffffff",
};

export const KEEPER = {
  shirt: "#facc15",
  shorts: "#111827",
  socks: "#facc15",
};
