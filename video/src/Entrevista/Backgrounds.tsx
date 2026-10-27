import React from "react";
import { random, useCurrentFrame } from "remotion";
import { FONT } from "./constants";

// Motas de luz flotando (efecto "mágico")
export const Motes: React.FC<{ count?: number; color?: string }> = ({ count = 40, color = "#fff6c8" }) => {
  const f = useCurrentFrame();
  return (
    <g>
      {new Array(count).fill(0).map((_, i) => {
        const x = random(`mx${i}`) * 1920 + Math.sin(f / 40 + i) * 30;
        const y = (random(`my${i}`) * 1200 - f * (0.4 + random(`ms${i}`) * 0.8)) % 1200;
        const yy = y < -40 ? y + 1240 : y;
        const tw = 0.3 + 0.7 * Math.abs(Math.sin(f / 15 + i));
        return (
          <circle
            key={i}
            cx={x}
            cy={yy}
            r={2 + random(`mr${i}`) * 4}
            fill={color}
            opacity={tw * 0.7}
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        );
      })}
    </g>
  );
};

// Pasillo del estadio con la puerta del vestuario. doorOpen 0..1
export const Hallway: React.FC<{ doorOpen: number; teamName: string }> = ({ doorOpen, teamName }) => {
  const door = { x: 1260, y: 300, w: 290, h: 600 };
  return (
    <g>
      <defs>
        <linearGradient id="hallWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b4a8c" />
          <stop offset="1" stopColor="#5b6fbf" />
        </linearGradient>
        <linearGradient id="hallFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8b5a2b" />
          <stop offset="1" stopColor="#5c3a1a" />
        </linearGradient>
        <radialGradient id="lampCone" cx="0.5" cy="0" r="1">
          <stop offset="0" stopColor="#ffe9a8" stopOpacity={0.55} />
          <stop offset="1" stopColor="#ffe9a8" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="doorGlow" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#fff7d6" />
          <stop offset="1" stopColor="#ffc861" />
        </radialGradient>
        <linearGradient id="wood" x1="0" x2="1">
          <stop offset="0" stopColor="#a0612c" />
          <stop offset="1" stopColor="#7a4518" />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={900} fill="url(#hallWall)" />
      {/* zócalo de azulejos */}
      <rect x={0} y={700} width={1920} height={200} fill="#e8eefc" />
      {new Array(24).fill(0).map((_, i) => (
        <line key={i} x1={i * 82} y1={700} x2={i * 82} y2={900} stroke="#c7d2f0" strokeWidth={3} />
      ))}
      <line x1={0} y1={790} x2={1920} y2={790} stroke="#c7d2f0" strokeWidth={3} />
      <rect x={0} y={690} width={1920} height={14} fill="#facc15" />
      {/* suelo */}
      <rect x={0} y={900} width={1920} height={180} fill="url(#hallFloor)" />
      {new Array(10).fill(0).map((_, i) => (
        <line key={i} x1={0} y1={920 + i * 18 * (1 + i * 0.15)} x2={1920} y2={920 + i * 18 * (1 + i * 0.15)} stroke="rgba(0,0,0,0.12)" strokeWidth={2} />
      ))}
      {/* banderines y cuadros */}
      <g transform="translate(260 260)">
        <rect x={-110} y={-90} width={220} height={170} rx={12} fill="#f5d08a" stroke="#8b5a2b" strokeWidth={10} />
        <path d="M -60 -50 L 60 -50 L 70 40 L -70 40 Z" fill="#2563eb" />
        <text y={10} fontFamily={FONT} fontSize={40} fontWeight={700} textAnchor="middle" fill="#fff">10</text>
      </g>
      <g transform="translate(720 220)">
        <path d="M -120 -40 L 120 -40 L 0 110 Z" fill="#facc15" />
        <text y={14} fontFamily={FONT} fontSize={34} fontWeight={700} textAnchor="middle" fill="#1e3a8a">
          {teamName}
        </text>
      </g>
      {/* lámparas */}
      {[260, 720, 1400].map((lx) => (
        <g key={lx}>
          <path d={`M ${lx - 260} 900 L ${lx - 40} 40 L ${lx + 40} 40 L ${lx + 260} 900 Z`} fill="url(#lampCone)" />
          <rect x={lx - 50} y={20} width={100} height={24} rx={12} fill="#fff7d6" />
        </g>
      ))}
      {/* puerta */}
      <rect x={door.x - 20} y={door.y - 20} width={door.w + 40} height={door.h + 20} rx={10} fill="#e2e8f0" />
      <rect x={door.x} y={door.y} width={door.w} height={door.h} fill="url(#doorGlow)" />
      <g transform={`translate(${door.x} 0) scale(${1 - doorOpen * 0.82} 1) translate(${-door.x} 0)`}>
        <rect x={door.x} y={door.y} width={door.w} height={door.h} rx={6} fill="url(#wood)" />
        <rect x={door.x + 30} y={door.y + 40} width={door.w - 60} height={220} rx={10} fill="rgba(0,0,0,0.12)" />
        <rect x={door.x + 30} y={door.y + 300} width={door.w - 60} height={260} rx={10} fill="rgba(0,0,0,0.12)" />
        <circle cx={door.x + door.w - 36} cy={door.y + 320} r={14} fill="#facc15" />
      </g>
      {doorOpen > 0 && (
        <path
          d={`M ${door.x} 900 L ${door.x + door.w} 900 L ${door.x + door.w + 260 * doorOpen} 1080 L ${door.x - 120 * doorOpen} 1080 Z`}
          fill="#ffe9a8"
          opacity={0.45 * doorOpen}
        />
      )}
      {/* cartel */}
      <g transform={`translate(${door.x + door.w / 2} ${door.y - 70})`}>
        <rect x={-180} y={-40} width={360} height={80} rx={40} fill="#1e3a8a" stroke="#facc15" strokeWidth={6} />
        <text y={14} fontFamily={FONT} fontSize={40} fontWeight={700} textAnchor="middle" fill="#fff">
          VESTUARIO
        </text>
      </g>
    </g>
  );
};

// Vestuario: taquillas, camisetas colgadas, banco y luz cálida
export const LockerRoom: React.FC<{ teamName: string }> = ({ teamName }) => (
  <g>
    <defs>
      <linearGradient id="lrWall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f4d9a8" />
        <stop offset="1" stopColor="#e7b877" />
      </linearGradient>
      <linearGradient id="locker" x1="0" x2="1">
        <stop offset="0" stopColor="#3b82f6" />
        <stop offset="1" stopColor="#1d4ed8" />
      </linearGradient>
      <radialGradient id="warm" cx="0.5" cy="0.2" r="0.8">
        <stop offset="0" stopColor="#fff3c4" stopOpacity={0.6} />
        <stop offset="1" stopColor="#fff3c4" stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect x={0} y={0} width={1920} height={1080} fill="url(#lrWall)" />
    {new Array(9).fill(0).map((_, i) => {
      const x = 40 + i * 210;
      return (
        <g key={i}>
          <rect x={x} y={120} width={190} height={640} rx={12} fill="url(#locker)" />
          {[0, 1, 2, 3].map((k) => (
            <rect key={k} x={x + 55} y={160 + k * 18} width={80} height={8} rx={4} fill="rgba(0,0,0,0.25)" />
          ))}
          <circle cx={x + 165} cy={430} r={9} fill="#facc15" />
          {/* camiseta colgada */}
          <g transform={`translate(${x + 95} 330)`}>
            <path d="M -60 -40 L -25 -55 Q 0 -40 25 -55 L 60 -40 L 75 0 L 45 10 L 45 120 L -45 120 L -45 10 L -75 0 Z" fill={i % 2 ? "#ffffff" : "#60a5fa"} />
            <text y={70} fontFamily={FONT} fontSize={52} fontWeight={700} textAnchor="middle" fill={i % 2 ? "#2563eb" : "#fff"}>
              {[1, 4, 7, 9, 10, 11, 5, 8, 3][i]}
            </text>
          </g>
        </g>
      );
    })}
    {/* banco */}
    <rect x={0} y={780} width={1920} height={50} rx={10} fill="#a0612c" />
    <rect x={0} y={826} width={1920} height={12} fill="#7a4518" />
    <rect x={0} y={838} width={1920} height={242} fill="#c08a52" />
    {/* balón y toalla */}
    <g transform="translate(1650 740)">
      <circle r={42} fill="#fff" stroke="#333" strokeWidth={3} />
      <polygon points="0,-14 13,-4 8,12 -8,12 -13,-4" fill="#333" />
    </g>
    <text x={960} y={80} fontFamily={FONT} fontSize={56} fontWeight={700} textAnchor="middle" fill="#1e3a8a" opacity={0.85}>
      ★ {teamName} ★
    </text>
    <rect x={0} y={0} width={1920} height={1080} fill="url(#warm)" />
  </g>
);
