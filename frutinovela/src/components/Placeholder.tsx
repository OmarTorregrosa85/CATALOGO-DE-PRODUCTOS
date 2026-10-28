import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EscenaResuelta } from "../calcular";
import { COLORES_ACTO, pad2 } from "../config";
import { FUENTE_TEXTO, FUENTE_TITULO } from "../fuentes";

/** Se muestra cuando no hay clip para la escena, para que el render nunca falle. */
export const Placeholder: React.FC<{ escena: EscenaResuelta }> = ({ escena }) => {
  const frame = useCurrentFrame();
  const [a, b] = COLORES_ACTO[escena.acto] ?? ["#222", "#555"];
  const flotar = Math.sin(frame / 20) * 10;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${135 + Math.sin(frame / 60) * 10}deg, ${a}, ${b})`,
        justifyContent: "center",
        alignItems: "center",
        padding: 120,
        paddingBottom: 300,
        textAlign: "center",
        color: "#fff",
      }}
    >
      <div style={{ fontFamily: FUENTE_TITULO, fontSize: 220, lineHeight: 1, opacity: 0.9, transform: `translateY(${flotar}px)` }}>
        ESCENA {pad2(escena.id)}
      </div>
      <div style={{ fontFamily: FUENTE_TEXTO, fontWeight: 800, fontSize: 64, marginTop: 30, maxWidth: 1500 }}>
        {escena.descripcion}
      </div>
      {escena.faltantes.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: 40,
            right: 50,
            fontFamily: "monospace",
            fontSize: 26,
            background: "rgba(0,0,0,0.45)",
            padding: "10px 18px",
            borderRadius: 10,
            textAlign: "right",
          }}
        >
          Falta: {escena.faltantes.join(" · ")}
        </div>
      )}
    </AbsoluteFill>
  );
};
