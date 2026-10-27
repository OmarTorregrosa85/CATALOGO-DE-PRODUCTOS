import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import { AWAY, HOME, KEEPER, type GolazoProps } from "./constants";
import { Ball, Scoreboard } from "./Overlays";
import { Player } from "./Player";
import { Crowd, Floodlights, Goal, GOAL_LINE, Pitch, SharedDefs } from "./Stadium";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Momentos clave (frames locales de la escena)
const RUN_START = 35;
const RUN_END = 64;
const CONTACT = 69;
const IN_NET = 112;

const BALL_START = { x: 900, y: 935 };
const BALL_CTRL = { x: 735, y: 240 };
const BALL_END = { x: 1100, y: 428 };

const bezier = (t: number, a: number, c: number, b: number) =>
  (1 - t) * (1 - t) * a + 2 * (1 - t) * t * c + t * t * b;

export const FreeKick: React.FC<GolazoProps & { showHud?: boolean }> = ({
  playerName,
  playerNumber,
  homeTeam,
  awayTeam,
  showHud = true,
}) => {
  const f = useCurrentFrame();

  // --- balón ---
  const t = interpolate(f, [CONTACT, IN_NET], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  let ballX = bezier(t, BALL_START.x, BALL_CTRL.x, BALL_END.x);
  let ballY = bezier(t, BALL_START.y, BALL_CTRL.y, BALL_END.y);
  const ballR = interpolate(t, [0, 1], [20, 7.5]);
  if (f > IN_NET) {
    const drop = interpolate(f, [IN_NET, IN_NET + 25], [0, 1], { ...clamp, easing: Easing.bounce });
    ballX += drop * -6;
    ballY += drop * 62;
  }
  const spin = f > CONTACT ? (f - CONTACT) * 38 : 0;
  const shadowX = interpolate(t, [0, 1], [BALL_START.x, BALL_END.x]);
  const shadowY = interpolate(t, [0, 1], [BALL_START.y + 12, GOAL_LINE - 22]);

  // --- red ---
  const bulge =
    f < IN_NET ? 0 : Math.exp(-(f - IN_NET) / 14) * Math.abs(Math.cos((f - IN_NET) / 3)) * 1.2;

  // --- lanzador ---
  const runP = interpolate(f, [RUN_START, RUN_END], [0, 1], clamp);
  const kickerX = interpolate(runP, [0, 1], [610, 848]);
  const kickerY = interpolate(runP, [0, 1], [1130, 968]);
  const kickerScale = interpolate(runP, [0, 1], [1.6, 1.42]);
  const running = f >= RUN_START && f < RUN_END;
  const kicking = f >= RUN_END && f < CONTACT + 12;
  const kickAngle = kicking
    ? interpolate(f, [RUN_END, RUN_END + 2, CONTACT, CONTACT + 4, CONTACT + 12], [0, -0.9, 0.15, 1.15, 0.5], clamp)
    : null;
  const kickerArms = interpolate(f, [IN_NET + 4, IN_NET + 16], [0, 1], clamp);

  // --- barrera ---
  const wallJump = Math.sin(interpolate(f, [CONTACT, CONTACT + 26], [0, Math.PI], clamp)) * 38;

  // --- portero ---
  const dive = interpolate(f, [CONTACT + 14, IN_NET - 2], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const fall = interpolate(f, [IN_NET + 2, IN_NET + 22], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const keeperSway = f < CONTACT ? Math.sin(f / 6) * 6 : 0;
  const keeperX = 960 + keeperSway + dive * 105 + fall * 25;
  const keeperY = GOAL_LINE - 4 - dive * 55 + fall * 55;
  const keeperRot = dive * 72 + fall * 18;

  // --- cámara ---
  const zoom = interpolate(f, [0, CONTACT, IN_NET], [1, 1.05, 1.16], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const shake = f >= IN_NET && f < IN_NET + 14 ? (random(`sh${f}`) - 0.5) * 18 * (1 - (f - IN_NET) / 14) : 0;
  const flash = interpolate(f, [IN_NET, IN_NET + 3, IN_NET + 14], [0, 0.85, 0], clamp);

  const wall = [870, 912, 954, 996];

  return (
    <AbsoluteFill style={{ backgroundColor: "#0c1222" }}>
      <svg
        width={1920}
        height={1080}
        style={{
          transform: `translate(${shake}px, ${shake * 0.6}px) scale(${zoom})`,
          transformOrigin: "960px 560px",
        }}
      >
        <SharedDefs />
        <Crowd height={272} excitement={f > IN_NET ? 1 : 0.15} />
        <Floodlights intensity={1} />
        <Pitch />
        <Goal layer="back" bulge={bulge} />
        <Player
          x={keeperX}
          y={keeperY}
          scale={0.62}
          kit={KEEPER}
          view="front"
          armsUp={0.45 + dive * 0.55}
          rotate={keeperRot}
        />
        <Goal layer="front" bulge={bulge} />
        {wall.map((wx, i) => (
          <Player
            key={wx}
            x={wx}
            y={720 - wallJump * (0.85 + (i % 2) * 0.2)}
            scale={0.74}
            kit={HOME}
            view="front"
            guarding
          />
        ))}
        {/* sombra del balón */}
        <ellipse cx={shadowX} cy={shadowY} rx={ballR * 1.1} ry={ballR * 0.35} fill="rgba(0,0,0,0.3)" />
        <Ball x={ballX} y={ballY} r={ballR} spin={spin} />
        {/* estela del balón */}
        {f > CONTACT && f < IN_NET &&
          [1, 2, 3, 4, 5].map((k) => {
            const tk = interpolate(f - k * 1.5, [CONTACT, IN_NET], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
            return (
              <circle
                key={k}
                cx={bezier(tk, BALL_START.x, BALL_CTRL.x, BALL_END.x)}
                cy={bezier(tk, BALL_START.y, BALL_CTRL.y, BALL_END.y)}
                r={interpolate(tk, [0, 1], [18, 7]) * (1 - k * 0.12)}
                fill="#fff"
                opacity={0.25 - k * 0.04}
              />
            );
          })}
        <Player
          x={kickerX}
          y={kickerY}
          scale={kickerScale}
          kit={AWAY}
          view="back"
          runPhase={running ? (f - RUN_START) / 11 : null}
          kickAngle={kickAngle}
          armsUp={kickerArms}
          number={playerNumber}
          name={playerName}
        />
      </svg>
      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: flash }} />
      {showHud && (
        <Scoreboard homeTeam={homeTeam} awayTeam={awayTeam} home={2} away={2} clock="90:00" added="+3" />
      )}
    </AbsoluteFill>
  );
};
