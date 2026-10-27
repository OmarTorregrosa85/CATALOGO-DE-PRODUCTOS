import React from "react";
import { FONT } from "./constants";

type Look = {
  skin: string;
  skinShade: string;
  hair: string;
  eyes: string;
  shirt: string;
  shirtShade: string;
};

export type Expression = {
  mouthOpen?: number; // 0..1
  smile?: number; // 0..1
  blink?: number; // 0..1
  wink?: number; // 0..1, cierra solo el ojo derecho
  browRaise?: number; // -1 (enfadado/serio) .. 1 (sorpresa)
  browSad?: number; // 0..1 cejas tristes/emocionadas
  lookX?: number; // -1..1
  lookY?: number; // -1..1
  tears?: number; // 0..1 ojos brillosos
  sparkle?: number; // 0..1 brillo extra en los ojos
};

type HeadProps = Expression & {
  id: string;
  look: Look;
  hairStyle: "player" | "reporter";
};

const Eye: React.FC<{
  id: string;
  cx: number;
  side: 1 | -1;
  look: Look;
  closed: number;
  lookX: number;
  lookY: number;
  tears: number;
  sparkle: number;
}> = ({ id, cx, side, look, closed, lookX, lookY, tears, sparkle }) => {
  const cy = 2;
  const open = Math.max(0.04, 1 - closed);
  const clip = `${id}-eye-${side}`;
  return (
    <g>
      <defs>
        <clipPath id={clip}>
          <ellipse cx={cx} cy={cy} rx={27} ry={34 * open} />
        </clipPath>
        <radialGradient id={`${clip}-iris`} cx="0.5" cy="0.35" r="0.65">
          <stop offset="0" stopColor="#fff" stopOpacity={0.35} />
          <stop offset="0.35" stopColor={look.eyes} />
          <stop offset="1" stopColor="#111" />
        </radialGradient>
      </defs>
      <ellipse cx={cx} cy={cy} rx={27} ry={34 * open} fill="#fdfdfd" />
      <g clipPath={`url(#${clip})`}>
        <ellipse cx={cx} cy={cy - 22} rx={30} ry={14} fill="rgba(120,80,60,0.18)" />
        <circle cx={cx + lookX * 8} cy={cy + 4 + lookY * 8} r={20} fill={`url(#${clip}-iris)`} />
        <circle cx={cx + lookX * 9} cy={cy + 4 + lookY * 9} r={10} fill="#0b0b0b" />
        <circle cx={cx + lookX * 8 - 8} cy={cy - 6 + lookY * 8} r={7} fill="#fff" />
        <circle cx={cx + lookX * 8 + 8} cy={cy + 12 + lookY * 8} r={3} fill="#fff" />
        {sparkle > 0 && (
          <path
            d={`M ${cx + 6} ${cy - 14} l 3 7 l 7 3 l -7 3 l -3 7 l -3 -7 l -7 -3 l 7 -3 Z`}
            fill="#fff"
            opacity={sparkle}
          />
        )}
        {tears > 0 && (
          <ellipse cx={cx} cy={cy + 30} rx={26} ry={9} fill="#bfe3ff" opacity={0.7 * tears} />
        )}
      </g>
      {/* párpado superior y pestañas */}
      <path
        d={`M ${cx - 29} ${cy - 6 * open} Q ${cx} ${cy - 62 * open} ${cx + 29} ${cy - 6 * open}`}
        stroke="#2a1a12"
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={`M ${cx + side * 26} ${cy - 22 * open} l ${side * 10} ${-8}`}
        stroke="#2a1a12"
        strokeWidth={4}
        strokeLinecap="round"
      />
      {closed > 0.85 && (
        <path
          d={`M ${cx - 26} ${cy} Q ${cx} ${cy + 12} ${cx + 26} ${cy}`}
          stroke="#2a1a12"
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
        />
      )}
    </g>
  );
};

const Mouth: React.FC<{ id: string; open: number; smile: number }> = ({ id, open, smile }) => {
  const w = 24 + smile * 10 + open * 4;
  const corner = -smile * 10;
  if (open < 0.08) {
    return (
      <path
        d={`M ${-w} ${corner} Q 0 ${12 + smile * 14} ${w} ${corner}`}
        stroke="#7a2e22"
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
      />
    );
  }
  const h = 10 + open * 34 + smile * 6;
  const d = `M ${-w} ${corner} Q 0 ${4 - smile * 4} ${w} ${corner} Q ${w * 0.85} ${h} 0 ${h} Q ${-w * 0.85} ${h} ${-w} ${corner} Z`;
  return (
    <g>
      <defs>
        <clipPath id={`${id}-mouth`}>
          <path d={d} />
        </clipPath>
      </defs>
      <path d={d} fill="#5a1717" />
      <g clipPath={`url(#${id}-mouth)`}>
        <rect x={-w} y={corner - 4} width={w * 2} height={10 + smile * 3} fill="#fff" />
        <ellipse cx={0} cy={h + 2} rx={w * 0.6} ry={12} fill="#e8707a" />
      </g>
      <path d={d} fill="none" stroke="#7a2e22" strokeWidth={3} />
    </g>
  );
};

export const Head: React.FC<HeadProps> = ({
  id,
  look,
  hairStyle,
  mouthOpen = 0,
  smile = 0.5,
  blink = 0,
  wink = 0,
  browRaise = 0,
  browSad = 0,
  lookX = 0,
  lookY = 0,
  tears = 0,
  sparkle = 0,
}) => {
  const browY = -50 - browRaise * 10;
  const inner = browSad * 10 - Math.min(0, browRaise) * -8;
  return (
    <g>
      <defs>
        <radialGradient id={`${id}-skin`} cx="0.38" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ffe9d6" stopOpacity={0.9} />
          <stop offset="0.12" stopColor={look.skin} />
          <stop offset="1" stopColor={look.skinShade} />
        </radialGradient>
        <linearGradient id={`${id}-hair`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor={look.hair} stopOpacity={0.75} />
          <stop offset="0.4" stopColor={look.hair} />
          <stop offset="1" stopColor="#140b06" />
        </linearGradient>
      </defs>

      {hairStyle === "reporter" && (
        <path
          d="M -118 -30 C -150 80 -150 190 -110 250 L 110 250 C 150 190 150 80 118 -30 C 100 -150 -100 -150 -118 -30 Z"
          fill={`url(#${id}-hair)`}
        />
      )}

      {/* orejas */}
      <ellipse cx={-106} cy={14} rx={20} ry={28} fill={look.skinShade} />
      <ellipse cx={106} cy={14} rx={20} ry={28} fill={look.skinShade} />

      {/* cara */}
      <path
        d="M 0 -122 C 72 -122 112 -76 110 -10 C 108 54 70 116 0 124 C -70 116 -108 54 -110 -10 C -112 -76 -72 -122 0 -122 Z"
        fill={`url(#${id}-skin)`}
      />

      {/* pelo */}
      {hairStyle === "player" ? (
        <g fill={`url(#${id}-hair)`}>
          <path d="M -114 -10 C -128 -112 -48 -156 8 -146 C 84 -156 130 -96 114 -10 C 104 -58 86 -80 54 -86 C 32 -70 -8 -76 -32 -90 C -64 -80 -98 -56 -114 -10 Z" />
          <path d="M -20 -140 C -10 -175 25 -180 40 -168 C 22 -164 12 -152 10 -140 Z" />
          <path d="M 30 -142 C 50 -170 80 -168 92 -150 C 74 -152 60 -146 54 -136 Z" />
        </g>
      ) : (
        <g fill={`url(#${id}-hair)`}>
          <path d="M -116 -4 C -126 -118 -40 -158 12 -148 C 90 -150 132 -90 116 -4 C 98 -66 60 -94 20 -96 C -8 -70 -60 -54 -116 -4 Z" />
          <circle cx={-86} cy={60} r={9} fill="#facc15" />
          <circle cx={86} cy={60} r={9} fill="#facc15" />
        </g>
      )}

      {/* cejas */}
      <g stroke={look.hair} strokeWidth={9} strokeLinecap="round" fill="none">
        <path d={`M -68 ${browY + 4} Q -46 ${browY - 8} -20 ${browY + 2 - inner}`} />
        <path d={`M 68 ${browY + 4} Q 46 ${browY - 8} 20 ${browY + 2 - inner}`} />
      </g>

      <Eye id={id} cx={-42} side={-1} look={look} closed={blink} lookX={lookX} lookY={lookY} tears={tears} sparkle={sparkle} />
      <Eye id={id} cx={42} side={1} look={look} closed={Math.max(blink, wink)} lookX={lookX} lookY={lookY} tears={tears} sparkle={sparkle} />

      {/* nariz */}
      <path d="M -8 44 Q 0 54 9 44" stroke={look.skinShade} strokeWidth={5} fill="none" strokeLinecap="round" />
      <ellipse cx={-3} cy={34} rx={5} ry={7} fill="#fff" opacity={0.25} />

      {/* mejillas */}
      <ellipse cx={-66} cy={52} rx={20} ry={11} fill="#ff8f8f" opacity={0.4} />
      <ellipse cx={66} cy={52} rx={20} ry={11} fill="#ff8f8f" opacity={0.4} />

      <g transform="translate(0 80)">
        <Mouth id={id} open={mouthOpen} smile={smile} />
      </g>
    </g>
  );
};

// Busto: cabeza + cuello + torso. Coordenadas con la cabeza en (0,0)
export const Bust: React.FC<
  HeadProps & {
    tilt?: number;
    number?: number;
    team?: string;
    medal?: boolean;
    thumbsUp?: number; // 0..1
  }
> = ({ tilt = 0, number, team, medal = false, thumbsUp = 0, ...head }) => {
  const { look, id } = head;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-shirt`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={look.shirt} />
          <stop offset="1" stopColor={look.shirtShade} />
        </linearGradient>
      </defs>
      {/* cuello */}
      <rect x={-30} y={95} width={60} height={70} rx={20} fill={look.skinShade} />
      {/* torso */}
      <path
        d="M -190 520 C -200 250 -150 180 -40 160 L 40 160 C 150 180 200 250 190 520 Z"
        fill={`url(#${id}-shirt)`}
      />
      {head.hairStyle === "player" ? (
        <>
          <path d="M -42 158 L 0 215 L 42 158" stroke="#fff" strokeWidth={12} fill="none" strokeLinejoin="round" />
          <g transform="translate(-82 250)">
            <path d="M -22 -24 L 22 -24 L 22 6 Q 0 30 -22 6 Z" fill="#facc15" stroke="#fff" strokeWidth={3} />
            <text y={4} fontFamily={FONT} fontSize={14} fontWeight={700} textAnchor="middle" fill="#1e3a8a">
              {team?.slice(0, 3)}
            </text>
          </g>
          {number !== undefined && (
            <text x={80} y={290} fontFamily={FONT} fontSize={70} fontWeight={700} fill="#fff" textAnchor="middle">
              {number}
            </text>
          )}
          {/* toalla en el hombro */}
          <path d="M 70 165 C 120 165 170 200 175 300 L 140 310 C 130 230 105 200 60 190 Z" fill="#f8fafc" />
          <path d="M 150 230 L 168 228 M 145 260 L 172 258" stroke="#cbd5e1" strokeWidth={4} />
        </>
      ) : (
        <>
          <path d="M -50 160 L 0 260 L 50 160 Z" fill="#fff" />
          <path d="M -50 160 L -10 240 L -60 300 Z M 50 160 L 10 240 L 60 300 Z" fill={look.shirtShade} />
          <rect x={60} y={240} width={70} height={36} rx={6} fill="#fff" />
          <text x={95} y={265} fontFamily={FONT} fontSize={18} fontWeight={700} textAnchor="middle" fill={look.shirtShade}>
            PRENSA
          </text>
        </>
      )}
      {medal && (
        <g>
          <path d="M -40 160 L -6 300 L 6 300 L 40 160 L 26 160 L 0 270 L -26 160 Z" fill="#dc2626" />
          <circle cx={0} cy={322} r={34} fill="#f5c542" stroke="#b8860b" strokeWidth={5} />
          <circle cx={-10} cy={312} r={9} fill="#fff6c8" opacity={0.7} />
          <path d="M 0 302 l 6 13 l 14 1 l -11 9 l 4 14 l -13 -8 l -13 8 l 4 -14 l -11 -9 l 14 -1 Z" fill="#b8860b" />
        </g>
      )}
      {thumbsUp > 0 && (
        <g transform={`translate(-150 ${520 - 330 * thumbsUp})`}>
          <path d="M -40 200 L -30 40 L 30 40 L 40 200 Z" fill={look.shirt} />
          <rect x={-38} y={-20} width={76} height={68} rx={26} fill={look.skin} />
          <rect x={-14} y={-78} width={28} height={70} rx={14} fill={look.skin} />
          <path d="M -30 0 L 30 0 M -30 20 L 30 20" stroke={look.skinShade} strokeWidth={4} strokeLinecap="round" />
        </g>
      )}
      <g transform={`rotate(${tilt} 0 100)`}>
        <Head {...head} />
      </g>
    </g>
  );
};
