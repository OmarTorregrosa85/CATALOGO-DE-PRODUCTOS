import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Acto } from "../config";
import { FUENTE_TEXTO } from "../fuentes";
import { Rayos } from "./Rayos";
import { TextoTelenovela } from "./TextoTelenovela";

export const RotuloActo: React.FC<{ acto: Acto }> = ({ acto }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sub = spring({ frame: frame - 18, fps, config: { damping: 12 } });
  const linea = interpolate(frame, [10, 35], [0, 900], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <Rayos colorA="#3a0610" colorB="#6a040f" velocidad={0.4} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <TextoTelenovela texto={`ACTO ${acto.numero}`} tamano={190} />
        <div style={{ width: linea, height: 16, background: "#FFD60A", border: "5px solid #000", borderRadius: 8, margin: "26px 0" }} />
        <div
          style={{
            fontFamily: FUENTE_TEXTO,
            fontWeight: 900,
            fontSize: 96,
            color: "#fff",
            opacity: sub,
            transform: `translateY(${(1 - sub) * 60}px)`,
            WebkitTextStroke: "10px #000",
            paintOrder: "stroke fill",
          }}
        >
          {acto.titulo}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
