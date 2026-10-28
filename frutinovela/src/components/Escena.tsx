import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { EscenaResuelta } from "../calcular";
import { ESCENA_DRAMATICA, VOLUMEN_SFX } from "../config";
import { Subtitulos } from "./Subtitulos";
import { Visual } from "./Visual";

/** Zoom dramático con sacudida para la escena 18. */
const ZoomDramatico: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const escala = interpolate(frame, [0, 35, 400], [1, 1.35, 1.5], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const sacudida = interpolate(frame, [0, 18], [14, 0], { extrapolateRight: "clamp" });
  const x = Math.sin(frame * 2.3) * sacudida;
  const y = Math.cos(frame * 1.7) * sacudida;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px) scale(${escala})` }}>{children}</AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(circle, rgba(0,0,0,0) 35%, rgba(90,0,0,0.6) 100%)" }} />
    </AbsoluteFill>
  );
};

export const EscenaVideo: React.FC<{ escena: EscenaResuelta }> = ({ escena }) => {
  const visual = <Visual escena={escena} />;
  const d = escena.duracion;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {escena.id === ESCENA_DRAMATICA ? <ZoomDramatico>{visual}</ZoomDramatico> : visual}

      {escena.voz && (
        <Sequence from={escena.vozInicio} name="Voz">
          <Audio src={escena.voz} />
        </Sequence>
      )}

      {escena.sfxSrc && (
        <Audio
          src={escena.sfxSrc}
          volume={(f) =>
            interpolate(f, [0, 6, d - 20, d], [0, VOLUMEN_SFX, VOLUMEN_SFX, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
        />
      )}

      <Subtitulos personaje={escena.personaje} texto={escena.texto} inicio={escena.vozInicio} frames={escena.vozFrames} />
    </AbsoluteFill>
  );
};
