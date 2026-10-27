import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Confetti } from "../Golazo/Overlays";
import { Hallway, LockerRoom, Motes } from "./Backgrounds";
import { Bust, type Expression } from "./Character";
import {
  blinkAt,
  FONT,
  lineDuration,
  PLAYER_LOOK,
  REPORTER_LOOK,
  talkMouth,
  type EntrevistaProps,
} from "./constants";
import { Walker } from "./Walker";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Transición de "iris" clásica de dibujos animados
const Iris: React.FC<{
  children: React.ReactNode;
  radius: number;
  cx?: number;
  cy?: number;
}> = ({ children, radius, cx = 960, cy = 540 }) => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <AbsoluteFill style={{ clipPath: `circle(${radius}px at ${cx}px ${cy}px)` }}>{children}</AbsoluteFill>
  </AbsoluteFill>
);

const Subtitle: React.FC<{ speaker: string; text: string; progress: number; color: string }> = ({
  speaker,
  text,
  progress,
  color,
}) => {
  const words = text.split(" ");
  const shown = Math.ceil(words.length * progress);
  return (
    <div
      style={{
        position: "absolute",
        left: 160,
        right: 160,
        bottom: 60,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          background: color,
          color: "#fff",
          fontSize: 30,
          fontWeight: 700,
          padding: "6px 24px",
          borderRadius: 30,
          marginBottom: -14,
          zIndex: 1,
          boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        }}
      >
        {speaker}
      </div>
      <div
        style={{
          background: "rgba(255,255,255,0.94)",
          color: "#1e1b4b",
          fontSize: 50,
          fontWeight: 600,
          lineHeight: 1.25,
          padding: "26px 44px 20px",
          borderRadius: 40,
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          border: `5px solid ${color}`,
        }}
      >
        {words.map((w, i) => (
          <span key={i} style={{ opacity: i < shown ? 1 : 0 }}>
            {w}{" "}
          </span>
        ))}
      </div>
    </div>
  );
};

const Microphone: React.FC<{ x: number; y: number; rotate: number; scale: number }> = ({ x, y, rotate, scale }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
    <rect x={-16} y={10} width={32} height={180} rx={14} fill="#1f2937" />
    <rect x={-34} y={40} width={68} height={60} rx={10} fill="#ef4444" />
    <text y={80} fontFamily={FONT} fontSize={26} fontWeight={700} textAnchor="middle" fill="#fff">
      TV7
    </text>
    <circle cx={0} cy={0} r={38} fill="#374151" />
    <circle cx={-12} cy={-12} r={12} fill="#6b7280" />
  </g>
);

// 1) Cartela de título
export const TitleCard: React.FC = () => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const pop = spring({ frame: f - 6, fps, config: { damping: 9 } });
  const trail = interpolate(f, [0, 30], [0, 1], clamp);
  return (
    <Iris radius={interpolate(f, [durationInFrames - 12, durationInFrames], [1200, 0], clamp)}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #3b5bdb 0%, #1e2a78 50%, #0b1033 100%)" }}>
        <svg width={1920} height={1080}>
          {new Array(70).fill(0).map((_, i) => (
            <circle
              key={i}
              cx={random(`s${i}`) * 1920}
              cy={random(`t${i}`) * 1080}
              r={1.5 + random(`r${i}`) * 3}
              fill="#fff"
              opacity={0.4 + 0.6 * Math.abs(Math.sin(f / 8 + i))}
            />
          ))}
          <path
            d="M 260 760 C 600 300, 1300 300, 1660 700"
            stroke="#ffe08a"
            strokeWidth={8}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={2000}
            strokeDashoffset={2000 * (1 - trail)}
            style={{ filter: "drop-shadow(0 0 12px #ffd54a)" }}
          />
          <Motes count={30} />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT,
            transform: `scale(${pop})`,
          }}
        >
          <div style={{ fontSize: 60, color: "#bfdbfe", fontWeight: 600 }}>Después de la</div>
          <div
            style={{
              fontSize: 170,
              fontWeight: 700,
              color: "#ffd54a",
              textShadow: "0 8px 0 #b45309, 0 16px 40px rgba(0,0,0,0.5)",
            }}
          >
            Gran Final
          </div>
          <div style={{ fontSize: 46, color: "#fff", fontWeight: 500 }}>Una entrevista en el vestuario</div>
        </div>
      </AbsoluteFill>
    </Iris>
  );
};

// 2) El futbolista llega por el pasillo y entra al vestuario
export const HallwayScene: React.FC<EntrevistaProps> = ({ playerNumber, teamName }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const walkIn = interpolate(f, [0, 95], [0, 1], clamp);
  const enter = interpolate(f, [135, 162], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const x = interpolate(walkIn, [0, 1], [-180, 1060]) + enter * 345;
  const walking = f < 95 || f >= 135;
  const doorOpen = interpolate(f, [88, 118], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  const wave = f >= 100 && f < 135 ? (f - 100) / 35 : 0;
  const atCamera = f >= 95 && f < 135;

  return (
    <Iris
      radius={interpolate(f, [0, 14, durationInFrames - 12, durationInFrames], [0, 1200, 1200, 0], clamp)}
      cx={f > 100 ? 1405 : 960}
      cy={f > 100 ? 600 : 540}
    >
      <AbsoluteFill>
        <svg width={1920} height={1080}>
          <Hallway doorOpen={doorOpen} teamName={teamName} />
          <g opacity={1 - enter}>
            <Walker
              x={x}
              y={960 - enter * 60}
              scale={0.9 - enter * 0.2}
              walkPhase={walking ? f / 22 : null}
              wave={wave}
              number={playerNumber}
              blink={blinkAt(f, 20)}
              wink={interpolate(f, [118, 122, 128, 132], [0, 1, 1, 0], clamp)}
              smile={atCamera ? 1 : 0.7}
              mouthOpen={atCamera ? 0.45 : 0}
              lookX={atCamera ? 0 : walking && f < 95 ? 0.7 : 0.5}
              browRaise={atCamera ? 0.6 : 0}
            />
          </g>
          <Motes count={35} />
        </svg>
      </AbsoluteFill>
    </Iris>
  );
};

const Scene: React.FC<{ children: React.ReactNode; teamName: string; zoom: number; blur: number }> = ({
  children,
  teamName,
  zoom,
  blur,
}) => (
  <AbsoluteFill>
    <svg
      width={1920}
      height={1080}
      style={{ position: "absolute", filter: `blur(${blur}px)`, transform: `scale(${zoom})` }}
    >
      <LockerRoom teamName={teamName} />
    </svg>
    {children}
  </AbsoluteFill>
);

// 3) La periodista hace la pregunta
export const QuestionScene: React.FC<EntrevistaProps> = ({ playerNumber, teamName, question }) => {
  const f = useCurrentFrame();
  const start = 14;
  const dur = lineDuration(question);
  const speaking = f >= start && f < start + dur - 10;
  const progress = interpolate(f, [start, start + dur - 12], [0, 1], clamp);
  const drift = interpolate(f, [0, 140], [1, 1.04], clamp);
  const after = f > start + dur - 10;

  return (
    <Iris radius={interpolate(f, [0, 14], [0, 1200], { ...clamp, easing: Easing.inOut(Easing.cubic) })}>
      <Scene teamName={teamName} zoom={1.05 * drift} blur={4}>
        <svg width={1920} height={1080} style={{ position: "absolute", transform: `scale(${drift})` }}>
          <g transform="translate(540 470) scale(1.2)">
            <Bust
              id="rep2"
              look={REPORTER_LOOK}
              hairStyle="reporter"
              mouthOpen={speaking ? talkMouth(f) : 0}
              smile={0.7}
              blink={blinkAt(f, 50)}
              lookX={0.6}
              browRaise={speaking ? 0.4 + 0.3 * Math.sin(f / 9) : 0.2}
              tilt={Math.sin(f / 20) * 3}
            />
          </g>
          {/* brazo con micrófono */}
          <path d="M 700 900 C 760 820 830 760 880 720" stroke={REPORTER_LOOK.shirt} strokeWidth={60} strokeLinecap="round" fill="none" />
          <circle cx={890} cy={712} r={32} fill={REPORTER_LOOK.skin} />
          <Microphone x={930} y={640} rotate={40} scale={1.1} />
          <g transform="translate(1380 450) scale(1.25)">
            <Bust
              id="pl2"
              look={PLAYER_LOOK}
              hairStyle="player"
              number={playerNumber}
              team={teamName}
              medal
              smile={after ? 1 : 0.75}
              mouthOpen={after ? 0.3 : 0}
              blink={blinkAt(f, 10)}
              lookX={-0.6}
              browRaise={after ? 0.7 : 0.1}
              tilt={-3 + Math.sin(f / 25) * 2}
            />
          </g>
          <Motes count={20} />
        </svg>
        <Subtitle speaker="PERIODISTA" text={question} progress={progress} color={REPORTER_LOOK.shirt} />
      </Scene>
    </Iris>
  );
};

// Expresión de cada frase de la respuesta
const MOODS: Expression[] = [
  { browRaise: 0.9, smile: 0.9, sparkle: 0.4 },
  { browRaise: -0.2, smile: 0.5, lookX: 0.4, lookY: -0.5 },
  { browRaise: 0.6, smile: 1, sparkle: 1 },
  { browSad: 1, smile: 0.6, tears: 1, lookY: -0.2 },
  { browRaise: 1, smile: 1, sparkle: 1 },
];

// 4) Primer plano: el futbolista responde
export const AnswerScene: React.FC<EntrevistaProps> = ({ playerName, playerNumber, teamName, answer }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  let t = 10;
  const lines = answer.map((text, i) => {
    const d = lineDuration(text);
    const line = { text, start: t, end: t + d, mood: MOODS[i % MOODS.length], i };
    t += d;
    return line;
  });
  const current = lines.find((l) => f >= l.start && f < l.end) ?? lines[lines.length - 1];
  const speaking = f >= current.start && f < current.end - 12;
  const progress = interpolate(f, [current.start, current.end - 14], [0, 1], clamp);
  const isLast = current.i === lines.length - 1 && f >= current.start;

  const zoom = interpolate(f, [0, 480], [1, 1.08], clamp);
  const bounce = isLast ? -Math.abs(Math.sin((f - current.start) / 4)) * 22 : 0;
  const tagIn = spring({ frame: f - 8, fps, config: { damping: 14 } });
  const tagOut = interpolate(f, [100, 115], [1, 0], clamp);
  const mood = current.mood;

  return (
    <Scene teamName={teamName} zoom={1.35 * zoom} blur={7}>
      <svg width={1920} height={1080} style={{ position: "absolute", transform: `scale(${zoom})`, transformOrigin: "960px 400px" }}>
        <g transform={`translate(960 ${450 + bounce}) scale(1.9)`}>
          <Bust
            id="pl3"
            look={PLAYER_LOOK}
            hairStyle="player"
            number={playerNumber}
            team={teamName}
            medal
            {...mood}
            mouthOpen={speaking ? talkMouth(f) : mood.smile && mood.smile > 0.9 ? 0.25 : 0}
            blink={blinkAt(f, 33)}
            tilt={Math.sin(f / 18) * 3 + (current.i === 0 ? Math.sin(f / 4) * 3 : 0)}
          />
        </g>
        <Microphone x={1430} y={780} rotate={-38} scale={1.4} />
        <Motes count={25} />
      </svg>
      {isLast && <Confetti start={current.start + 10} count={140} />}
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 70,
          fontFamily: FONT,
          transform: `translateX(${(1 - tagIn) * -600}px)`,
          opacity: tagOut,
        }}
      >
        <div style={{ background: PLAYER_LOOK.shirt, color: "#fff", fontSize: 54, fontWeight: 700, padding: "10px 30px", borderRadius: "24px 24px 24px 0" }}>
          {playerName} · {playerNumber}
        </div>
        <div style={{ background: "#ffd54a", color: "#1e3a8a", fontSize: 32, fontWeight: 600, padding: "6px 30px", borderRadius: "0 0 20px 20px", display: "inline-block" }}>
          Jugador del partido · {teamName}
        </div>
      </div>
      <Subtitle speaker={playerName} text={current.text} progress={progress} color={PLAYER_LOOK.shirt} />
    </Scene>
  );
};

// 5) Cierre: guiño, pulgar arriba e iris final
export const EndingScene: React.FC<EntrevistaProps> = ({ playerNumber, teamName }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const thumb = spring({ frame: f, fps, config: { damping: 10 } });
  const ding = interpolate(f, [8, 14, 22], [0, 1, 0], clamp);
  const radius = interpolate(f, [28, 46], [1200, 0], { ...clamp, easing: Easing.in(Easing.cubic) });
  const fin = spring({ frame: f - 44, fps, config: { damping: 12 } });
  const title = spring({ frame: f - 2, fps, config: { damping: 8 } });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Iris radius={radius} cx={960} cy={420}>
        <Scene teamName={teamName} zoom={1.35 * 1.08} blur={7}>
          <svg width={1920} height={1080} style={{ position: "absolute", transform: "scale(1.08)", transformOrigin: "960px 400px" }}>
            <g transform="translate(960 450) scale(1.9)">
              <Bust
                id="pl4"
                look={PLAYER_LOOK}
                hairStyle="player"
                number={playerNumber}
                team={teamName}
                medal
                smile={1}
                mouthOpen={0.2}
                wink={interpolate(f, [2, 6], [0, 1], clamp)}
                browRaise={0.6}
                sparkle={1}
                thumbsUp={thumb}
                tilt={4}
              />
            </g>
            {/* destello de sonrisa */}
            <g transform={`translate(1040 600) scale(${ding * 1.6}) rotate(${f * 6})`}>
              <path d="M 0 -40 L 8 -8 L 40 0 L 8 8 L 0 40 L -8 8 L -40 0 L -8 -8 Z" fill="#fff" style={{ filter: "drop-shadow(0 0 10px #fff)" }} />
            </g>
          </svg>
          <div
            style={{
              position: "absolute",
              top: 60,
              width: "100%",
              textAlign: "center",
              fontFamily: FONT,
              fontSize: 120,
              fontWeight: 700,
              color: "#ffd54a",
              textShadow: "0 7px 0 #b45309, 0 14px 30px rgba(0,0,0,0.4)",
              transform: `scale(${title})`,
            }}
          >
            ¡Campeones!
          </div>
        </Scene>
      </Iris>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: fin }}>
        <div style={{ fontFamily: FONT, fontSize: 140, fontWeight: 600, color: "#ffd54a", transform: `scale(${fin})` }}>Fin</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
