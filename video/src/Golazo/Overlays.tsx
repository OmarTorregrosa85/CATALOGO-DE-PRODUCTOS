import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { AWAY, FONT, HOME } from "./constants";

export const Scoreboard: React.FC<{
  homeTeam: string;
  awayTeam: string;
  home: number;
  away: number;
  clock: string;
  highlightAway?: number; // 0..1
  added?: string;
}> = ({ homeTeam, awayTeam, home, away, clock, highlightAway = 0, added }) => {
  const box: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    padding: "0 18px",
    height: 64,
    fontFamily: FONT,
    fontSize: 32,
    color: "#fff",
    letterSpacing: 1,
  };
  return (
    <div
      style={{
        position: "absolute",
        top: 48,
        left: 60,
        display: "flex",
        borderRadius: 10,
        overflow: "hidden",
        boxShadow: "0 8px 30px rgba(0,0,0,0.45)",
      }}
    >
      <div style={{ ...box, background: "#0b1530", fontSize: 22, color: "#cbd5f5" }}>FINAL</div>
      <div style={{ ...box, background: HOME.shirt }}>{homeTeam}</div>
      <div style={{ ...box, background: "#f8fafc", color: "#0b1530", fontSize: 40, padding: "0 22px" }}>
        {home} – <span style={{ color: `rgb(${11 + 200 * highlightAway}, ${21 + 140 * highlightAway}, ${48})`, marginLeft: 10 }}>{away}</span>
      </div>
      <div style={{ ...box, background: AWAY.shirt }}>{awayTeam}</div>
      <div style={{ ...box, background: "#0b1530", minWidth: 110, justifyContent: "center" }}>{clock}</div>
      {added && (
        <div style={{ ...box, background: "#16a34a", fontSize: 26 }}>{added}</div>
      )}
    </div>
  );
};

export const Ball: React.FC<{ x: number; y: number; r: number; spin: number }> = ({ x, y, r, spin }) => (
  <g transform={`translate(${x} ${y}) rotate(${spin})`}>
    <circle r={r} fill="#fafafa" stroke="#222" strokeWidth={r * 0.08} />
    <polygon
      points={[0, 1, 2, 3, 4]
        .map((i) => {
          const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
          return `${Math.cos(a) * r * 0.38},${Math.sin(a) * r * 0.38}`;
        })
        .join(" ")}
      fill="#222"
    />
    {[0, 1, 2, 3, 4].map((i) => {
      const a = (i / 5) * Math.PI * 2 + Math.PI / 2;
      return <circle key={i} cx={Math.cos(a) * r * 0.82} cy={Math.sin(a) * r * 0.82} r={r * 0.2} fill="#222" />;
    })}
  </g>
);

const CONFETTI_COLORS = ["#facc15", "#ffffff", "#1d4ed8", "#60a5fa", "#fde68a", "#e5e7eb"];

export const Confetti: React.FC<{ count?: number; start?: number }> = ({ count = 160, start = 0 }) => {
  const frame = useCurrentFrame() - start;
  if (frame < 0) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={1920} height={1080}>
        {new Array(count).fill(0).map((_, i) => {
          const speed = 4 + random(`cs${i}`) * 6;
          const x0 = random(`cx${i}`) * 1920;
          const y = -60 - random(`cy${i}`) * 900 + frame * speed;
          const x = x0 + Math.sin(frame * 0.08 + i) * 40;
          const rot = frame * (3 + random(`cr${i}`) * 8) + i * 30;
          const w = 10 + random(`cw${i}`) * 10;
          return (
            <rect
              key={i}
              x={-w / 2}
              y={-4}
              width={w}
              height={8 + random(`ch${i}`) * 6}
              fill={CONFETTI_COLORS[i % CONFETTI_COLORS.length]}
              transform={`translate(${x} ${y % 1200}) rotate(${rot}) scale(1 ${Math.cos(rot / 20)})`}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

export const Fireworks: React.FC<{ bursts: { at: number; x: number; y: number; color: string }[] }> = ({
  bursts,
}) => {
  const frame = useCurrentFrame();
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {bursts.map((b, bi) => {
        const t = frame - b.at;
        if (t < 0 || t > 60) return null;
        const opacity = Math.max(0, 1 - t / 60);
        return (
          <g key={bi} opacity={opacity}>
            {new Array(36).fill(0).map((_, i) => {
              const a = (i / 36) * Math.PI * 2;
              const v = 6 + random(`fw${bi}-${i}`) * 3;
              const d = v * t * (1 - t / 140);
              const px = b.x + Math.cos(a) * d;
              const py = b.y + Math.sin(a) * d + 0.04 * t * t;
              return <circle key={i} cx={px} cy={py} r={4} fill={b.color} style={{ filter: `drop-shadow(0 0 6px ${b.color})` }} />;
            })}
          </g>
        );
      })}
    </svg>
  );
};

// Copa genérica de "orejas grandes"
export const Trophy: React.FC<{ shine: number }> = ({ shine }) => (
  <svg width={520} height={720} viewBox="0 0 260 360">
    <defs>
      <linearGradient id="silver" x1="0" x2="1">
        <stop offset="0" stopColor="#9ca3af" />
        <stop offset={Math.min(0.95, Math.max(0.05, shine))} stopColor="#ffffff" />
        <stop offset="1" stopColor="#6b7280" />
      </linearGradient>
    </defs>
    {/* asas */}
    <path
      d="M 70 70 C 0 40, -5 190, 85 200 L 90 185 C 30 175, 25 80, 75 95 Z"
      fill="url(#silver)"
    />
    <path
      d="M 190 70 C 260 40, 265 190, 175 200 L 170 185 C 230 175, 235 80, 185 95 Z"
      fill="url(#silver)"
    />
    {/* copa */}
    <path d="M 60 40 L 200 40 C 200 150, 170 210, 130 220 C 90 210, 60 150, 60 40 Z" fill="url(#silver)" />
    <ellipse cx={130} cy={40} rx={70} ry={12} fill="#e5e7eb" stroke="#9ca3af" strokeWidth={2} />
    {/* tallo y base */}
    <path d="M 118 218 L 142 218 L 148 280 L 112 280 Z" fill="url(#silver)" />
    <path d="M 85 280 L 175 280 L 190 330 L 70 330 Z" fill="#374151" />
    <rect x={62} y={330} width={136} height={18} rx={3} fill="#1f2937" />
    <rect x={100} y={295} width={60} height={18} rx={2} fill="#d4af37" />
  </svg>
);
