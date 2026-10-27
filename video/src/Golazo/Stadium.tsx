import React, { useMemo } from "react";
import { random, useCurrentFrame } from "remotion";

const CROWD_COLORS = ["#d62828", "#ffffff", "#1d4ed8", "#facc15", "#f4a261", "#1f2937"];

// Grada con público, flashes de cámaras y torres de luz
export const Crowd: React.FC<{
  height: number;
  excitement?: number; // 0..1, cuánto salta el público
}> = ({ height, excitement = 0 }) => {
  const frame = useCurrentFrame();

  const fans = useMemo(() => {
    const list: { x: number; y: number; c: string; seed: number }[] = [];
    const rows = Math.floor(height / 17);
    for (let r = 0; r < rows; r++) {
      for (let i = 0; i < 122; i++) {
        const seed = r * 1000 + i;
        list.push({
          x: i * 16 + (r % 2) * 8 + random(`x${seed}`) * 4,
          y: 22 + r * 17,
          c: CROWD_COLORS[Math.floor(random(`c${seed}`) * CROWD_COLORS.length)],
          seed,
        });
      }
    }
    return list;
  }, [height]);

  return (
    <g>
      <rect x={0} y={0} width={1920} height={height + 10} fill="#0c1222" />
      {fans.map((f) => {
        const jump =
          excitement *
          Math.max(0, Math.sin(frame * 0.5 + random(`j${f.seed}`) * 6.28)) *
          7;
        return <circle key={f.seed} cx={f.x} cy={f.y - jump} r={6} fill={f.c} opacity={0.85} />;
      })}
      {/* flashes de cámaras */}
      {new Array(18).fill(0).map((_, i) => {
        const seed = `flash${i}-${Math.floor(frame / 2)}`;
        if (random(seed) > 0.35 + (1 - excitement) * 0.4) return null;
        return (
          <circle
            key={i}
            cx={random(seed + "x") * 1920}
            cy={random(seed + "y") * height}
            r={5}
            fill="#fff"
            style={{ filter: "drop-shadow(0 0 8px #fff)" }}
          />
        );
      })}
      {/* valla publicitaria */}
      <rect x={0} y={height} width={1920} height={28} fill="#111827" />
      <rect x={0} y={height + 4} width={1920} height={20} fill="url(#adboard)" />
    </g>
  );
};

export const SharedDefs: React.FC = () => (
  <defs>
    <linearGradient id="adboard" x1="0" x2="1">
      <stop offset="0" stopColor="#1d4ed8" />
      <stop offset="0.5" stopColor="#0ea5e9" />
      <stop offset="1" stopColor="#1d4ed8" />
    </linearGradient>
    <radialGradient id="lightGlow">
      <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
      <stop offset="1" stopColor="#fff" stopOpacity="0" />
    </radialGradient>
    <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#1f7a32" />
      <stop offset="1" stopColor="#2f9e44" />
    </linearGradient>
  </defs>
);

export const Floodlights: React.FC<{ intensity: number }> = ({ intensity }) => (
  <g opacity={intensity}>
    {[180, 620, 1300, 1740].map((x) => (
      <g key={x}>
        <circle cx={x} cy={30} r={140} fill="url(#lightGlow)" opacity={0.5} />
        <rect x={x - 40} y={14} width={80} height={30} rx={4} fill="#f8fafc" />
      </g>
    ))}
  </g>
);

// Punto de fuga para la perspectiva del campo
const VX = 960;
const VY = 100;
export const GOAL_LINE = 520;

export const persp = (x0: number, y: number) =>
  VX + ((x0 - VX) * (y - VY)) / (GOAL_LINE - VY);

export const Pitch: React.FC = () => {
  const stripes = new Array(10).fill(0).map((_, i) => {
    const y1 = 300 + 780 * Math.pow(i / 10, 1.5);
    const y2 = 300 + 780 * Math.pow((i + 1) / 10, 1.5);
    return { y1, y2, dark: i % 2 === 0 };
  });
  const line = { stroke: "rgba(255,255,255,0.9)", strokeWidth: 4, fill: "none" };
  return (
    <g>
      <rect x={0} y={300} width={1920} height={780} fill="url(#grass)" />
      {stripes.map((s, i) =>
        s.dark ? <rect key={i} x={0} y={s.y1} width={1920} height={s.y2 - s.y1} fill="rgba(0,0,0,0.08)" /> : null,
      )}
      {/* línea de gol */}
      <line x1={0} y1={GOAL_LINE} x2={1920} y2={GOAL_LINE} {...line} />
      {/* área grande */}
      <path
        d={`M ${persp(520, GOAL_LINE)} ${GOAL_LINE} L ${persp(520, 690)} 690 L ${persp(1400, 690)} 690 L ${persp(1400, GOAL_LINE)} ${GOAL_LINE}`}
        {...line}
      />
      {/* área pequeña */}
      <path
        d={`M ${persp(760, GOAL_LINE)} ${GOAL_LINE} L ${persp(760, 575)} 575 L ${persp(1160, 575)} 575 L ${persp(1160, GOAL_LINE)} ${GOAL_LINE}`}
        {...line}
      />
      {/* punto de penalti */}
      <ellipse cx={960} cy={635} rx={7} ry={3} fill="#fff" />
      {/* media luna */}
      <path d={`M ${persp(820, 690)} 690 Q 960 760 ${persp(1100, 690)} 690`} {...line} />
    </g>
  );
};

// Portería. bulge = 0..1 deformación de la red por el balón (escuadra derecha)
export const GOAL = { left: 790, right: 1130, bar: 410 };

export const Goal: React.FC<{ bulge: number; layer: "back" | "front" }> = ({ bulge, layer }) => {
  const { left, right, bar } = GOAL;
  const backL = left + 22;
  const backR = right - 22;
  const backTop = bar - 14;
  const backBottom = GOAL_LINE - 26;
  const bx = 1095;
  const by = 430;
  const push = (px: number, py: number) => {
    const d = Math.hypot(px - bx, py - by);
    const k = Math.max(0, 1 - d / 160) * bulge;
    return { x: px + k * 10, y: py - k * 28 };
  };

  if (layer === "back") {
    const verticals = new Array(17).fill(0).map((_, i) => backL + ((backR - backL) * i) / 16);
    const horizontals = new Array(7).fill(0).map((_, i) => backTop + ((backBottom - backTop) * i) / 6);
    return (
      <g>
        <rect x={backL} y={backTop} width={backR - backL} height={backBottom - backTop} fill="rgba(255,255,255,0.06)" />
        <g stroke="rgba(255,255,255,0.45)" strokeWidth={1.5}>
          {verticals.map((vx) => {
            const a = push(vx, backTop);
            const b = push(vx, (backTop + backBottom) / 2);
            return (
              <path key={vx} d={`M ${a.x} ${a.y} Q ${b.x} ${b.y} ${vx} ${backBottom}`} fill="none" />
            );
          })}
          {horizontals.map((hy) => {
            const m = push((backL + backR) / 2 + 120, hy);
            return <path key={hy} d={`M ${backL} ${hy} Q ${m.x} ${m.y} ${backR} ${hy}`} fill="none" />;
          })}
          {/* laterales */}
          <line x1={left} y1={bar} x2={backL} y2={backTop} />
          <line x1={left} y1={GOAL_LINE} x2={backL} y2={backBottom} />
          <line x1={right} y1={bar} x2={backR} y2={backTop} />
          <line x1={right} y1={GOAL_LINE} x2={backR} y2={backBottom} />
        </g>
      </g>
    );
  }

  return (
    <g>
      <g stroke="#f8fafc" strokeWidth={8} strokeLinecap="round">
        <line x1={left} y1={GOAL_LINE} x2={left} y2={bar} />
        <line x1={right} y1={GOAL_LINE} x2={right} y2={bar} />
        <line x1={left} y1={bar} x2={right} y2={bar} />
      </g>
    </g>
  );
};
