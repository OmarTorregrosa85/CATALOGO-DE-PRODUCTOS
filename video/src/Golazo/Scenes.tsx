import React from "react";
import {
  AbsoluteFill,
  Easing,
  Freeze,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AWAY, FONT, type GolazoProps } from "./constants";
import { FreeKick } from "./FreeKick";
import { Confetti, Fireworks, Scoreboard, Trophy } from "./Overlays";
import { Player } from "./Player";
import { Crowd, Floodlights, SharedDefs } from "./Stadium";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const fadeInOut = (f: number, a: number, b: number) =>
  interpolate(f, [a, a + 10, b - 10, b], [0, 1, 1, 0], clamp);

const BigText: React.FC<{
  children: React.ReactNode;
  size: number;
  opacity: number;
  y?: number;
  scale?: number;
  color?: string;
}> = ({ children, size, opacity, y = 0, scale = 1, color = "#fff" }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top: "50%",
      textAlign: "center",
      fontFamily: FONT,
      fontWeight: 900,
      fontSize: size,
      color,
      opacity,
      letterSpacing: 2,
      textShadow: "0 6px 30px rgba(0,0,0,0.7), 0 0 4px rgba(0,0,0,0.8)",
      transform: `translateY(calc(-50% + ${y}px)) scale(${scale})`,
    }}
  >
    {children}
  </div>
);

// 1) Presentación: estadio, minuto 90, empate y falta
export const Intro: React.FC<GolazoProps> = (props) => {
  const f = useCurrentFrame();
  const lights = interpolate(f, [0, 4, 6, 10, 12, 22], [0, 1, 0.2, 1, 0.5, 1], clamp);
  const dim = interpolate(f, [0, 25, 95, 120], [0.85, 0.5, 0.5, 0.1], clamp);
  const seconds = Math.min(59, 50 + Math.floor(f / 11));
  const clock = f > 110 ? "90:00" : `89:${seconds}`;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ opacity: lights }}>
        <Freeze frame={0}>
          <FreeKick {...props} showHud={false} />
        </Freeze>
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: dim }} />
      <BigText size={64} opacity={fadeInOut(f, 8, 58)} y={-70} color="#93c5fd">
        FINAL DE LA
      </BigText>
      <BigText size={130} opacity={fadeInOut(f, 8, 58)} y={30}>
        CHAMPIONS LEAGUE
      </BigText>
      <BigText size={110} opacity={fadeInOut(f, 55, 92)}>
        MINUTO 90 · <span style={{ color: "#facc15" }}>2 – 2</span>
      </BigText>
      <BigText
        size={120}
        opacity={fadeInOut(f, 88, 122)}
        scale={interpolate(f, [88, 100], [1.4, 1], { ...clamp, easing: Easing.out(Easing.back(2)) })}
        color="#facc15"
      >
        ¡FALTA AL BORDE DEL ÁREA!
      </BigText>
      <Scoreboard homeTeam={props.homeTeam} awayTeam={props.awayTeam} home={2} away={2} clock={clock} />
    </AbsoluteFill>
  );
};

// 3) ¡GOOOL! y celebración
export const GoalCelebration: React.FC<GolazoProps> = ({ playerName, playerNumber, homeTeam, awayTeam }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const os = Math.min(6, 1 + Math.floor(f / 5));
  const pop = spring({ frame: f, fps, config: { damping: 8, mass: 0.6 } });
  const shake = f < 40 ? (random(`gs${f}`) - 0.5) * 14 : 0;
  const flash = interpolate(f, [0, 10], [0.9, 0], clamp);

  const slide = interpolate(f, [8, 55], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const playerX = interpolate(slide, [0, 1], [-250, 1560]);
  const scoreFlip = spring({ frame: f - 30, fps, config: { damping: 12 } });
  const away = f >= 32 ? 3 : 2;
  const pulse = f >= 32 ? 0.6 + 0.4 * Math.abs(Math.sin((f - 32) / 6)) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0c1222", overflow: "hidden" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <SharedDefs />
        <g opacity={0.9}>
          <Crowd height={760} excitement={1} />
        </g>
        <rect x={0} y={790} width={1920} height={290} fill="url(#grass)" />
        <Floodlights intensity={1} />
        <Player
          x={playerX}
          y={1040}
          scale={2.4}
          kit={AWAY}
          view="front"
          armsUp={1}
          rotate={-8 + Math.sin(f / 5) * 2}
        />
      </svg>
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      <div style={{ transform: `translate(${shake}px, ${shake * 0.5}px)`, position: "absolute", inset: 0 }}>
        <BigText size={190} opacity={1} y={-170} scale={pop} color="#facc15">
          ¡GO{"O".repeat(os)}L!
        </BigText>
        <BigText size={64} opacity={interpolate(f, [45, 60], [0, 1], clamp)} y={20}>
          {playerName} · {playerNumber}
        </BigText>
        <BigText size={46} opacity={interpolate(f, [55, 70], [0, 1], clamp)} y={90} color="#bfdbfe">
          GOLAZO DE TIRO LIBRE · 90+1&apos;
        </BigText>
      </div>
      <Confetti start={4} />
      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: flash }} />
      <div style={{ transform: `scale(${1 + 0.15 * scoreFlip * (1 - Math.min(1, (f - 30) / 40))})`, transformOrigin: "300px 80px" }}>
        <Scoreboard
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          home={2}
          away={away}
          clock="90+1'"
          highlightAway={pulse}
        />
      </div>
    </AbsoluteFill>
  );
};

// 4) Pitido final, copa y fuegos artificiales
export const Champions: React.FC<GolazoProps> = ({ playerName, homeTeam, awayTeam }) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const whistle = fadeInOut(f, 0, 62);
  const trophyIn = spring({ frame: f - 50, fps, config: { damping: 14, mass: 1.2 } });
  const rays = (f * 0.6) % 360;
  const titleIn = spring({ frame: f - 75, fps, config: { damping: 10 } });
  const fadeOut = interpolate(f, [durationInFrames - 20, durationInFrames], [1, 0], clamp);

  const bursts = new Array(14).fill(0).map((_, i) => ({
    at: 55 + i * 12,
    x: 200 + random(`bx${i}`) * 1520,
    y: 120 + random(`by${i}`) * 380,
    color: ["#facc15", "#60a5fa", "#f472b6", "#ffffff", "#34d399"][i % 5],
  }));

  return (
    <AbsoluteFill style={{ backgroundColor: "#020617", opacity: fadeOut }}>
      <AbsoluteFill
        style={{
          background: "radial-gradient(circle at 50% 55%, #1e3a8a 0%, #0b1530 45%, #020617 100%)",
          opacity: trophyIn,
        }}
      />
      {/* rayos de luz */}
      <AbsoluteFill style={{ opacity: trophyIn * 0.35 }}>
        <svg width={1920} height={1080}>
          <g transform={`translate(960 600) rotate(${rays})`}>
            {new Array(18).fill(0).map((_, i) => (
              <polygon key={i} points="0,0 -60,-1300 60,-1300" fill="#facc15" transform={`rotate(${i * 20})`} opacity={0.5} />
            ))}
          </g>
        </svg>
      </AbsoluteFill>
      <Fireworks bursts={bursts} />

      <BigText size={90} opacity={whistle} y={-60} color="#93c5fd">
        ¡PITIDO FINAL!
      </BigText>
      <BigText size={120} opacity={whistle} y={60}>
        {homeTeam} 2 – <span style={{ color: "#facc15" }}>3</span> {awayTeam}
      </BigText>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 300,
          transform: `translate(-50%, ${(1 - trophyIn) * 700}px) scale(${0.9 + 0.1 * trophyIn})`,
          filter: "drop-shadow(0 0 40px rgba(250,204,21,0.45))",
        }}
      >
        <Trophy shine={(f % 90) / 90} />
      </div>

      <BigText size={120} opacity={Math.min(1, titleIn)} y={-430} scale={titleIn} color="#facc15">
        ¡CAMPEONES DE EUROPA!
      </BigText>
      <div
        style={{
          position: "absolute",
          bottom: 50,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT,
          color: "#fff",
          fontSize: 44,
          opacity: interpolate(f, [100, 120], [0, 1], clamp),
          textShadow: "0 4px 20px rgba(0,0,0,0.8)",
        }}
      >
        {awayTeam} · Gol de tiro libre en el minuto 90 de {playerName}
      </div>
      {f > 70 && <Confetti start={70} count={200} />}
    </AbsoluteFill>
  );
};
