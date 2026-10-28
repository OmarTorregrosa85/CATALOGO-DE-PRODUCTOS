import React from "react";
import { linearTiming, TransitionPresentation, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { AbsoluteFill } from "remotion";
import { construirLinea, framesDeTransicion, FrutinovelaProps, Segmento, Transicion } from "./calcular";
import { Cierre } from "./components/Cierre";
import { EscenaVideo } from "./components/Escena";
import { Intro } from "./components/Intro";
import { MusicaFondo } from "./components/MusicaFondo";
import { RotuloActo } from "./components/RotuloActo";
import { pad2 } from "./config";
import { flashZoom } from "./transiciones/flashZoom";

const presentacion = (t: Transicion) =>
  (t === "slide"
    ? slide({ direction: "from-right" })
    : t === "flash"
      ? flashZoom()
      : fade()) as TransitionPresentation<Record<string, unknown>>;

const contenido = (s: Segmento) => {
  switch (s.tipo) {
    case "intro":
      return <Intro />;
    case "acto":
      return <RotuloActo acto={s.acto} />;
    case "escena":
      return <EscenaVideo escena={s.escena} />;
    case "cierre":
      return <Cierre />;
  }
};

const nombre = (s: Segmento) =>
  s.tipo === "escena" ? `Escena ${pad2(s.escena.id)}` : s.tipo === "acto" ? `Acto ${s.acto.numero}` : s.tipo;

export const Frutinovela: React.FC<FrutinovelaProps> = ({ escenas, musica }) => {
  const linea = construirLinea(escenas);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <TransitionSeries>
        {linea.segmentos.map((s, i) => (
          <React.Fragment key={i}>
            <TransitionSeries.Sequence durationInFrames={s.duracion} name={nombre(s)}>
              {contenido(s)}
            </TransitionSeries.Sequence>
            {i < linea.transiciones.length && (
              <TransitionSeries.Transition
                presentation={presentacion(linea.transiciones[i])}
                timing={linearTiming({ durationInFrames: framesDeTransicion(linea.transiciones[i]) })}
              />
            )}
          </React.Fragment>
        ))}
      </TransitionSeries>
      {musica && <MusicaFondo musica={musica} linea={linea} />}
    </AbsoluteFill>
  );
};
