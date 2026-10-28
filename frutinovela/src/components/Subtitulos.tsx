import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORES_PERSONAJE } from "../config";
import { FUENTE_TEXTO } from "../fuentes";

const MAX_PALABRAS = 9;
const MAX_LETRAS = 52;
const FIN_FRASE = /[.!?…]["»”)]?$/;

type Palabra = { texto: string; aparece: number };

/**
 * Reparte las palabras a lo largo de la duración de la voz: cada palabra pesa según su número de letras,
 * más una pausa extra después de comas y puntos. Es una sincronía aproximada sin necesidad de transcribir.
 */
const repartirPalabras = (texto: string, inicio: number, frames: number): Palabra[][] => {
  const palabras = texto.split(/\s+/).filter(Boolean);
  const pesos = palabras.map((p) => p.length + 2 + (FIN_FRASE.test(p) ? 6 : /[,;:]$/.test(p) ? 3 : 0));
  const total = pesos.reduce((a, b) => a + b, 0);

  let acumulado = 0;
  const conTiempo = palabras.map((p, i) => {
    const aparece = inicio + Math.round((acumulado / total) * frames) - 2;
    acumulado += pesos[i];
    return { texto: p, aparece };
  });

  // Agrupa en bloques cortos para que quepan en pantalla.
  const bloques: Palabra[][] = [];
  let actual: Palabra[] = [];
  for (const p of conTiempo) {
    const letras = actual.reduce((a, w) => a + w.texto.length + 1, 0) + p.texto.length;
    if (actual.length > 0 && (actual.length >= MAX_PALABRAS || letras > MAX_LETRAS)) {
      bloques.push(actual);
      actual = [];
    }
    actual.push(p);
    if (FIN_FRASE.test(p.texto) && actual.length >= 3) {
      bloques.push(actual);
      actual = [];
    }
  }
  if (actual.length) bloques.push(actual);
  return bloques;
};

export const Subtitulos: React.FC<{
  personaje: string;
  texto: string;
  inicio: number;
  frames: number;
}> = ({ personaje, texto, inicio, frames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bloques = useMemo(() => repartirPalabras(texto, inicio, frames), [texto, inicio, frames]);

  const fin = inicio + frames + Math.round(fps * 1.2);
  const indice = bloques.findLastIndex((b) => frame >= b[0].aparece);
  if (indice === -1 || frame > fin) return null;

  const bloque = bloques[indice];
  const color = COLORES_PERSONAJE[personaje] ?? "#FFFFFF";
  const opacidad = interpolate(frame, [inicio - 4, inicio + 4, fin - 8, fin], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", opacity: opacidad }}>
      <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 38%)" }} />
      <div style={{ position: "relative", marginBottom: 70, maxWidth: 1600, textAlign: "center", fontFamily: FUENTE_TEXTO }}>
        <div
          style={{
            fontSize: 50,
            fontWeight: 900,
            color,
            textTransform: "uppercase",
            letterSpacing: 2,
            WebkitTextStroke: "8px #000",
            paintOrder: "stroke fill",
            marginBottom: 6,
          }}
        >
          {personaje}
        </div>
        <div style={{ fontSize: 66, fontWeight: 800, lineHeight: 1.18, color: "#fff" }}>
          {bloque.map((p, i) => {
            const s = spring({ frame: frame - p.aparece, fps, config: { damping: 14, stiffness: 260 }, durationInFrames: 8 });
            const visible = frame >= p.aparece;
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  marginRight: 18,
                  opacity: visible ? 1 : 0,
                  transform: `scale(${visible ? 0.7 + 0.3 * s : 0.7})`,
                  textShadow: "0 0 12px rgba(0,0,0,0.9), 4px 4px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000",
                }}
              >
                {p.texto}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
