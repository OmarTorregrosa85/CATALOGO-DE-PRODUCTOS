import React from "react";
import { Composition, Still } from "remotion";
import { calcularMetadata, FrutinovelaProps } from "./calcular";
import { ALTO, ANCHO, FPS } from "./config";
import { Frutinovela } from "./Frutinovela";
import { Miniatura } from "./Miniatura";

const propsIniciales: FrutinovelaProps = { escenas: [], musica: null };

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Frutinovela"
      component={Frutinovela}
      width={ANCHO}
      height={ALTO}
      fps={FPS}
      // La duración real se calcula a partir de los audios en calcularMetadata.
      durationInFrames={FPS * 60}
      defaultProps={propsIniciales}
      calculateMetadata={calcularMetadata}
    />
    <Still id="Miniatura" component={Miniatura} width={1280} height={720} />
  </>
);
