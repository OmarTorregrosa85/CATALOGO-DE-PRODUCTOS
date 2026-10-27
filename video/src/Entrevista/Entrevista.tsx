import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { ANSWER, ENDING, HALLWAY, QUESTION, TITLE, type EntrevistaProps } from "./constants";
import { AnswerScene, EndingScene, HallwayScene, QuestionScene, TitleCard } from "./Scenes";

// Entrevista post partido en el vestuario, estilo dibujo animado
export const Entrevista: React.FC<EntrevistaProps> = (props) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Series>
        <Series.Sequence durationInFrames={TITLE} name="Título">
          <TitleCard />
        </Series.Sequence>
        <Series.Sequence durationInFrames={HALLWAY} name="Pasillo">
          <HallwayScene {...props} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={QUESTION} name="Pregunta">
          <QuestionScene {...props} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={ANSWER} name="Respuesta">
          <AnswerScene {...props} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={ENDING} name="Cierre">
          <EndingScene {...props} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
