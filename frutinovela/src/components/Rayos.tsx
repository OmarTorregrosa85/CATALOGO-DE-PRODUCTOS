import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

/** Fondo de rayos girando, típico de miniatura de telenovela. */
export const Rayos: React.FC<{ colorA: string; colorB: string; velocidad?: number }> = ({
  colorA,
  colorB,
  velocidad = 0.25,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: colorA, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 4000,
          height: 4000,
          marginLeft: -2000,
          marginTop: -2000,
          background: `repeating-conic-gradient(${colorA} 0deg 10deg, ${colorB} 10deg 20deg)`,
          transform: `rotate(${frame * velocidad}deg)`,
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(circle, rgba(0,0,0,0) 20%, rgba(0,0,0,0.75) 100%)" }} />
    </AbsoluteFill>
  );
};
