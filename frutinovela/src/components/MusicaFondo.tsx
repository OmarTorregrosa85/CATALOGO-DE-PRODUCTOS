import React from "react";
import { Audio, interpolate, Sequence } from "remotion";
import { Linea, Musica } from "../calcular";
import { VOLUMEN_MUSICA, VOLUMEN_MUSICA_CON_VOZ } from "../config";

const RAMPA = 10; // frames para bajar/subir el volumen alrededor de cada voz

/**
 * Música de fondo en loop durante todo el video: 0.12 normalmente y 0.06 mientras hay voz.
 * El loop se arma con secuencias consecutivas para conocer siempre el frame absoluto.
 */
export const MusicaFondo: React.FC<{ musica: Musica; linea: Linea }> = ({ musica, linea }) => {
  const voces: [number, number][] = [];
  linea.segmentos.forEach((s, i) => {
    if (s.tipo !== "escena") return;
    const inicio = linea.inicios[i] + s.escena.vozInicio;
    voces.push([inicio, inicio + s.escena.vozFrames]);
  });

  const volumen = (f: number) => {
    let ducking = 0;
    for (const [a, b] of voces) {
      if (f < a - RAMPA || f > b + RAMPA) continue;
      ducking = Math.max(ducking, f < a ? 1 - (a - f) / RAMPA : f > b ? 1 - (f - b) / RAMPA : 1);
    }
    const base = VOLUMEN_MUSICA - (VOLUMEN_MUSICA - VOLUMEN_MUSICA_CON_VOZ) * ducking;
    const fades = interpolate(f, [0, 30, linea.total - 60, linea.total], [0, 1, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return base * fades;
  };

  const vueltas = Math.ceil(linea.total / musica.frames);
  return (
    <>
      {Array.from({ length: vueltas }, (_, k) => {
        const desde = k * musica.frames;
        return (
          <Sequence key={k} from={desde} durationInFrames={Math.min(musica.frames, linea.total - desde)} name={`Música ${k + 1}`}>
            <Audio src={musica.src} volume={(f) => volumen(desde + f)} />
          </Sequence>
        );
      })}
    </>
  );
};
