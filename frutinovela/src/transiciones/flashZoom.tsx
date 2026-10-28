import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";

type Props = Record<string, never>;

/** La escena saliente hace un zoom violento, todo se vuelve blanco y la nueva escena aparece desde el flash. */
const FlashZoom: React.FC<TransitionPresentationComponentProps<Props>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
}) => {
  const saliendo = presentationDirection === "exiting";
  const escala = saliendo ? interpolate(p, [0, 1], [1, 1.8]) : interpolate(p, [0, 1], [1.25, 1]);
  const opacidad = saliendo ? interpolate(p, [0, 0.5], [1, 0], { extrapolateRight: "clamp" }) : interpolate(p, [0.4, 0.55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // El flash se dibuja una sola vez (en la escena entrante): sube rápido y se desvanece.
  const flash = saliendo ? 0 : interpolate(p, [0, 0.45, 0.55, 1], [0, 1, 1, 0]);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${escala})`, opacity: opacidad }}>{children}</AbsoluteFill>
      {!saliendo && <AbsoluteFill style={{ backgroundColor: "#fff", opacity: flash }} />}
    </AbsoluteFill>
  );
};

export const flashZoom = (): TransitionPresentation<Props> => ({ component: FlashZoom, props: {} });
