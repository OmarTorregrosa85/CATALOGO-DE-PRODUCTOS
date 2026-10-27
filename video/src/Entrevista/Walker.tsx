import React from "react";
import { Head, type Expression } from "./Character";
import { FONT, PLAYER_LOOK } from "./constants";

// Futbolista de cuerpo entero (cabeza grande, estilo dibujo animado)
export const Walker: React.FC<
  Expression & {
    x: number;
    y: number; // pies
    scale: number;
    walkPhase: number | null;
    wave: number; // 0..1
    number: number;
  }
> = ({ x, y, scale, walkPhase, wave, number, ...face }) => {
  const look = PLAYER_LOOK;
  const s = walkPhase === null ? 0 : Math.sin(walkPhase * Math.PI * 2);
  const bob = walkPhase === null ? 0 : -Math.abs(s) * 14;
  const liftL = Math.max(0, s) * 26;
  const liftR = Math.max(0, -s) * 26;
  const armSwing = s * 22;
  const waveAngle = -150 + Math.sin(wave * Math.PI * 6) * 18;

  const leg = (lx: number, lift: number) => (
    <g>
      <rect x={lx - 16} y={-150} width={32} height={70 - lift} rx={14} fill={look.skin} />
      <rect x={lx - 17} y={-92 - lift} width={34} height={72} rx={14} fill="#fff" />
      <ellipse cx={lx + 4} cy={-18 - lift} rx={30} ry={18} fill="#111827" />
      <ellipse cx={lx - 4} cy={-24 - lift} rx={10} ry={5} fill="#4b5563" />
    </g>
  );

  const arm = (side: 1 | -1, angle: number) => (
    <g transform={`translate(${side * 78} -290) rotate(${angle})`}>
      <rect x={-17} y={-6} width={34} height={58} rx={16} fill={look.shirt} />
      <rect x={-13} y={44} width={26} height={60} rx={13} fill={look.skin} />
      <circle cx={0} cy={110} r={18} fill={look.skin} />
    </g>
  );

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx={0} cy={0} rx={95} ry={16} fill="rgba(40,20,0,0.25)" />
      <g transform={`translate(0 ${bob})`}>
        {leg(-36, liftL)}
        {leg(36, liftR)}
        {/* pantalón */}
        <path d="M -70 -205 L 70 -205 L 76 -135 L 8 -135 L 0 -150 L -8 -135 L -76 -135 Z" fill="#0b1d4d" />
        {arm(-1, 10 + armSwing)}
        {wave > 0 ? arm(1, waveAngle) : arm(1, -10 + armSwing)}
        {/* camiseta */}
        <path d="M -80 -310 C -90 -260 -84 -230 -74 -195 L 74 -195 C 84 -230 90 -260 80 -310 C 40 -330 -40 -330 -80 -310 Z" fill={look.shirt} />
        <path d="M -30 -318 L 0 -285 L 30 -318" stroke="#fff" strokeWidth={8} fill="none" />
        <text x={0} y={-226} fontFamily={FONT} fontSize={50} fontWeight={700} fill="#fff" textAnchor="middle">
          {number}
        </text>
        {/* medalla */}
        <path d="M -30 -318 L -4 -250 L 4 -250 L 30 -318" stroke="#dc2626" strokeWidth={7} fill="none" />
        <circle cx={0} cy={-238} r={16} fill="#f5c542" stroke="#b8860b" strokeWidth={3} />
        <g transform="translate(0 -440) scale(0.95)">
          <Head id="walker" look={look} hairStyle="player" {...face} />
        </g>
      </g>
    </g>
  );
};
