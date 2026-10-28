import React from "react";
import { AbsoluteFill, getStaticFiles, Img } from "remotion";
import { Rayos } from "./components/Rayos";
import { TextoTelenovela } from "./components/TextoTelenovela";
import { GUION } from "./config";
import { FUENTE_TEXTO } from "./fuentes";

/** Miniatura 1280x720 para YouTube: imagen de /clips/miniatura.png + título grande. */
export const Miniatura: React.FC = () => {
  const imagen = getStaticFiles().find((f) => f.name.replace(/\\/g, "/").toLowerCase() === "clips/miniatura.png");

  return (
    <AbsoluteFill>
      {imagen ? (
        <Img src={imagen.src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <Rayos colorA="#7b0a3a" colorB="#b5179e" velocidad={0} />
      )}
      <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 60%)" }} />
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", padding: "0 40px 40px" }}>
        <div style={{ transform: "rotate(-3deg)" }}>
          <TextoTelenovela texto={GUION.titulo} tamano={104} rebote={false} style={{ maxWidth: 1200 }} />
        </div>
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 30,
          left: 30,
          background: "#e5383b",
          border: "6px solid #000",
          borderRadius: 16,
          padding: "6px 26px",
          fontFamily: FUENTE_TEXTO,
          fontWeight: 900,
          fontSize: 40,
          color: "#fff",
          textShadow: "3px 3px 0 #000",
          transform: "rotate(-4deg)",
        }}
      >
        FRUTINOVELA 🍍
      </div>
    </AbsoluteFill>
  );
};
