import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { CHAMPIONS, FREE_KICK, GOAL, INTRO, type GolazoProps } from "./constants";
import { FreeKick } from "./FreeKick";
import { Champions, GoalCelebration, Intro } from "./Scenes";

// Final de la Champions: falta en el minuto 90, gol por la escuadra y 2-3
export const Golazo: React.FC<GolazoProps> = (props) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Series>
        <Series.Sequence durationInFrames={INTRO} name="Presentación">
          <Intro {...props} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={FREE_KICK} name="Tiro libre">
          <FreeKick {...props} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={GOAL} name="¡Gol!">
          <GoalCelebration {...props} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={CHAMPIONS} name="Campeones">
          <Champions {...props} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
