import React from "react";
import { FONT } from "./constants";

type Kit = { shirt: string; shorts: string; socks: string };

type PlayerProps = {
  x: number;
  y: number; // posición de los pies
  scale: number;
  kit: Kit;
  view: "back" | "front";
  // 0..1, fase de la carrera; null = quieto
  runPhase?: number | null;
  // ángulo (rad) de la pierna derecha para el disparo; sustituye a la carrera
  kickAngle?: number | null;
  // 0 = brazos abajo, 1 = brazos arriba
  armsUp?: number;
  // brazos cruzados delante (barrera)
  guarding?: boolean;
  rotate?: number;
  number?: number;
  name?: string;
  skin?: string;
};

const THIGH = 48;
const SHIN = 50;

const Leg: React.FC<{
  hipX: number;
  a1: number;
  a2: number;
  kit: Kit;
  skin: string;
}> = ({ hipX, a1, a2, kit, skin }) => {
  const hipY = -98;
  const kx = hipX + THIGH * Math.sin(a1);
  const ky = hipY + THIGH * Math.cos(a1);
  const fx = kx + SHIN * Math.sin(a2);
  const fy = ky + SHIN * Math.cos(a2);
  return (
    <g strokeLinecap="round">
      <line x1={hipX} y1={hipY} x2={kx} y2={ky} stroke={skin} strokeWidth={17} />
      <line x1={kx} y1={ky} x2={fx} y2={fy} stroke={kit.socks} strokeWidth={15} />
      <ellipse cx={fx + 4 * Math.sign(Math.sin(a2) || 1)} cy={fy + 2} rx={12} ry={6} fill="#111" />
    </g>
  );
};

const Arm: React.FC<{
  side: 1 | -1;
  angle: number;
  bend: number;
  skin: string;
  shirt: string;
}> = ({ side, angle, bend, skin, shirt }) => {
  const sx = 27 * side;
  const sy = -168;
  const a = angle * side;
  const ex = sx + 34 * Math.sin(a);
  const ey = sy + 34 * Math.cos(a);
  const b = (angle + bend) * side;
  const hx = ex + 32 * Math.sin(b);
  const hy = ey + 32 * Math.cos(b);
  return (
    <g strokeLinecap="round">
      <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={shirt} strokeWidth={15} />
      <line x1={ex} y1={ey} x2={hx} y2={hy} stroke={skin} strokeWidth={12} />
      <circle cx={hx} cy={hy} r={7} fill={skin} />
    </g>
  );
};

export const Player: React.FC<PlayerProps> = ({
  x,
  y,
  scale,
  kit,
  view,
  runPhase = null,
  kickAngle = null,
  armsUp = 0,
  guarding = false,
  rotate = 0,
  number,
  name,
  skin = "#c98b5e",
}) => {
  let left = { a1: 0.12, a2: 0.05 };
  let right = { a1: -0.12, a2: -0.05 };
  let bob = 0;

  if (runPhase !== null) {
    const s = Math.sin(runPhase * Math.PI * 2);
    left = { a1: s * 0.7, a2: s * 0.7 - Math.max(0, -s) * 1.1 };
    right = { a1: -s * 0.7, a2: -s * 0.7 - Math.max(0, s) * 1.1 };
    bob = -Math.abs(s) * 8;
  }
  if (kickAngle !== null) {
    right = { a1: kickAngle, a2: kickAngle + Math.max(0, -kickAngle) * 0.9 };
    left = { a1: 0.25, a2: 0.15 };
  }

  const armAngle = 0.25 + armsUp * 2.6;
  const armBend = runPhase !== null ? -0.9 : 0.15;
  const swing = runPhase !== null ? Math.sin(runPhase * Math.PI * 2) * 0.5 : 0;

  return (
    <g transform={`translate(${x} ${y + bob * scale}) rotate(${rotate}) scale(${scale})`}>
      <ellipse cx={0} cy={2} rx={34} ry={8} fill="rgba(0,0,0,0.28)" />
      <Leg hipX={-11} a1={left.a1} a2={left.a2} kit={kit} skin={skin} />
      <Leg hipX={11} a1={right.a1} a2={right.a2} kit={kit} skin={skin} />
      {/* pantalón */}
      <path d="M -25 -118 L 25 -118 L 27 -88 L 2 -88 L 0 -96 L -2 -88 L -27 -88 Z" fill={kit.shorts} />
      {!guarding && (
        <>
          <Arm side={-1} angle={armAngle + swing} bend={armBend} skin={skin} shirt={kit.shirt} />
          <Arm side={1} angle={armAngle - swing} bend={armBend} skin={skin} shirt={kit.shirt} />
        </>
      )}
      {/* camiseta */}
      <path
        d="M -30 -172 Q 0 -180 30 -172 L 27 -116 L -27 -116 Z"
        fill={kit.shirt}
      />
      {view === "back" && number !== undefined && (
        <>
          {name && (
            <text
              x={0}
              y={-154}
              fontFamily={FONT}
              fontSize={9}
              fill="#fff"
              textAnchor="middle"
              letterSpacing={0.5}
            >
              {name}
            </text>
          )}
          <text
            x={0}
            y={-124}
            fontFamily={FONT}
            fontSize={30}
            fontWeight={900}
            fill="#fff"
            textAnchor="middle"
          >
            {number}
          </text>
        </>
      )}
      {view === "front" && (
        <path d="M -8 -175 L 0 -164 L 8 -175" stroke="#fff" strokeWidth={3} fill="none" />
      )}
      {guarding && (
        <g strokeLinecap="round">
          <line x1={-26} y1={-166} x2={-6} y2={-118} stroke={kit.shirt} strokeWidth={14} />
          <line x1={26} y1={-166} x2={6} y2={-118} stroke={kit.shirt} strokeWidth={14} />
          <circle cx={-3} cy={-110} r={8} fill={skin} />
          <circle cx={3} cy={-110} r={8} fill={skin} />
        </g>
      )}
      {/* cuello y cabeza */}
      <rect x={-6} y={-186} width={12} height={14} fill={skin} />
      <circle cx={0} cy={-198} r={18} fill={skin} />
      {view === "back" ? (
        <path d="M -18 -200 A 18 18 0 0 1 18 -200 L 17 -190 Q 0 -186 -17 -190 Z" fill="#2b1a10" />
      ) : (
        <path d="M -18 -202 A 18 18 0 0 1 18 -202 Q 8 -210 -18 -202 Z" fill="#2b1a10" />
      )}
    </g>
  );
};
