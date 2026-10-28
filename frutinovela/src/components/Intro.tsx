import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { GUION } from "../config";
import { FUENTE_TEXTO } from "../fuentes";
import { Rayos } from "./Rayos";
import { TextoTelenovela } from "./TextoTelenovela";

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const latido = 1 + Math.sin(frame / 6) * 0.015;
  const etiqueta = spring({ frame: frame - 45, fps, config: { damping: 10 } });
  const salida = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Rayos colorA="#7b0a3a" colorB="#b5179e" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 80, opacity: salida }}>
        <div style={{ transform: `scale(${latido}) rotate(-3deg)` }}>
          <TextoTelenovela texto={GUION.titulo} tamano={150} style={{ maxWidth: 1650 }} />
        </div>
        <div
          style={{
            marginTop: 50,
            transform: `scale(${etiqueta}) rotate(2deg)`,
            background: "#e5383b",
            border: "8px solid #000",
            borderRadius: 24,
            padding: "14px 48px",
            fontFamily: FUENTE_TEXTO,
            fontWeight: 900,
            fontSize: 64,
            color: "#fff",
            textShadow: "4px 4px 0 #000",
            boxShadow: "0 12px 0 #000",
          }}
        >
          🍍 UNA FRUTINOVELA 🍍
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
