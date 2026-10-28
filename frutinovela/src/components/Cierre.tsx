import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FUENTE_TEXTO } from "../fuentes";
import { Rayos } from "./Rayos";
import { TextoTelenovela } from "./TextoTelenovela";

export const Cierre: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const comentarios = spring({ frame: frame - 35, fps, config: { damping: 10 } });
  const boton = spring({ frame: frame - 90, fps, config: { damping: 9 } });
  const pulso = 1 + Math.max(0, Math.sin((frame - 90) / 7)) * 0.06;
  const flecha = Math.sin(frame / 5) * 12;

  return (
    <AbsoluteFill>
      <Rayos colorA="#10002b" colorB="#3c096c" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 40 }}>
        <TextoTelenovela texto="¿Tú la perdonarías?" tamano={150} />
        <div
          style={{
            fontFamily: FUENTE_TEXTO,
            fontWeight: 900,
            fontSize: 76,
            color: "#fff",
            WebkitTextStroke: "9px #000",
            paintOrder: "stroke fill",
            opacity: comentarios,
            transform: `scale(${0.6 + 0.4 * comentarios})`,
          }}
        >
          Déjalo en los comentarios <span style={{ display: "inline-block", transform: `translateY(${flecha}px)` }}>👇</span>
        </div>
        <div
          style={{
            marginTop: 30,
            transform: `scale(${boton * pulso})`,
            background: "#ff0000",
            color: "#fff",
            fontFamily: FUENTE_TEXTO,
            fontWeight: 900,
            fontSize: 64,
            padding: "22px 60px",
            borderRadius: 22,
            border: "7px solid #000",
            boxShadow: "0 12px 0 #000",
            textShadow: "3px 3px 0 #000",
          }}
        >
          🔔 Suscríbete para más Frutinovelas
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
