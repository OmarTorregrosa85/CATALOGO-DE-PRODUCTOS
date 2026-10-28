import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FUENTE_TITULO } from "../fuentes";

/**
 * Texto grande amarillo con contorno negro grueso, estilo miniatura de telenovela.
 * Cada letra entra con un rebote escalonado.
 */
export const TextoTelenovela: React.FC<{
  texto: string;
  tamano: number;
  color?: string;
  contorno?: number;
  retraso?: number;
  rebote?: boolean;
  style?: React.CSSProperties;
}> = ({ texto, tamano, color = "#FFD60A", contorno, retraso = 0, rebote = true, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const grosor = contorno ?? Math.round(tamano * 0.14);
  const palabras = texto.split(" ");
  let indice = 0;

  return (
    <div
      style={{
        fontFamily: FUENTE_TITULO,
        fontSize: tamano,
        lineHeight: 1.05,
        color,
        textAlign: "center",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: tamano * 0.28,
        ...style,
      }}
    >
      {palabras.map((palabra, p) => (
        <span key={p} style={{ display: "inline-flex", whiteSpace: "nowrap" }}>
          {[...palabra].map((letra) => {
            const i = indice++;
            const s = rebote
              ? spring({ frame: frame - retraso - i * 1.6, fps, config: { damping: 8, stiffness: 180, mass: 0.6 } })
              : 1;
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  transform: `translateY(${(1 - s) * -tamano * 1.4}px) scale(${0.4 + 0.6 * s})`,
                  opacity: Math.min(1, s * 3),
                  WebkitTextStroke: `${grosor}px #000`,
                  paintOrder: "stroke fill",
                  textShadow: `0 ${tamano * 0.06}px 0 #000, 0 ${tamano * 0.1}px ${tamano * 0.18}px rgba(0,0,0,0.55)`,
                }}
              >
                {letra}
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
};
