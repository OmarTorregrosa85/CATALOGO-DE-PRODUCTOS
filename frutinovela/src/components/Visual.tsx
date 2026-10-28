import React from "react";
import { AbsoluteFill, Img, interpolate, Loop, OffthreadVideo, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { Clip, EscenaResuelta } from "../calcular";
import { Placeholder } from "./Placeholder";

const llenar: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };

/** Efecto Ken Burns: zoom y paneo lento. La dirección cambia según la semilla. */
const KenBurns: React.FC<{ src: string; semilla: number }> = ({ src, semilla }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = interpolate(frame, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp" });
  const acercar = semilla % 2 === 0;
  const escala = acercar ? 1.05 + 0.2 * t : 1.25 - 0.2 * t;
  const dirX = semilla % 3 === 0 ? 1 : semilla % 3 === 1 ? -1 : 0;
  const dirY = semilla % 4 < 2 ? 1 : -1;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={src}
        style={{
          ...llenar,
          transform: `scale(${escala}) translate(${dirX * (t - 0.5) * 4}%, ${dirY * (t - 0.5) * 2.5}%)`,
        }}
      />
    </AbsoluteFill>
  );
};

const ClipVisual: React.FC<{ clip: Clip; duracion: number; semilla: number }> = ({ clip, duracion, semilla }) => {
  if (clip.tipo === "imagen") return <KenBurns src={clip.src} semilla={semilla} />;
  const video = <OffthreadVideo src={clip.src} muted style={llenar} />;
  // Si el clip es más corto que su parte de la escena, se repite en loop.
  if (clip.frames < duracion) return <Loop durationInFrames={clip.frames}>{video}</Loop>;
  return <AbsoluteFill>{video}</AbsoluteFill>;
};

/** Reparte los clips de la escena en partes iguales; si no hay ninguno, muestra el placeholder. */
export const Visual: React.FC<{ escena: EscenaResuelta }> = ({ escena }) => {
  const { clips, duracion } = escena;
  if (clips.length === 0) return <Placeholder escena={escena} />;

  const parte = Math.ceil(duracion / clips.length);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {clips.map((clip, i) => {
        const largo = i === clips.length - 1 ? duracion - parte * i : parte;
        return (
          <Sequence key={clip.nombre} from={parte * i} durationInFrames={largo} name={clip.nombre}>
            <ClipVisual clip={clip} duracion={largo} semilla={escena.id * 7 + i} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
