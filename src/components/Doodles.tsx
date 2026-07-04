"use client";
import { motion } from "framer-motion";
import { useId, type CSSProperties } from "react";

type DoodleProps = {
  className?: string;
  style?: CSSProperties;
  color?: string;
  size?: number;
};

export function Sparkle({ className, style, color = "#111", size = 24 }: DoodleProps) {
  return (
    <svg
      className={className}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M12 1.5c.7 4.5 2.3 6.1 6.8 6.8-4.5.7-6.1 2.3-6.8 6.8-.7-4.5-2.3-6.1-6.8-6.8C9.7 7.6 11.3 6 12 1.5Z"
        fill={color}
      />
    </svg>
  );
}

export function HeartDoodle({ className, style, color = "#F5B3CB", size = 28 }: DoodleProps) {
  return (
    <svg className={className} style={style} width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path
        d="M16 27S4 19.5 4 11.5C4 7.4 7.4 4 11.5 4c2 0 3.6.9 4.5 2.3C16.9 4.9 18.5 4 20.5 4 24.6 4 28 7.4 28 11.5 28 19.5 16 27 16 27Z"
        fill={color}
        stroke="#111"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function YarnSquiggle({ className, style, color = "#111", size = 80 }: DoodleProps) {
  return (
    <svg className={className} style={style} width={size} height={size * 0.4} viewBox="0 0 100 40" fill="none">
      <path
        d="M2 20 Q12 2 22 20 T42 20 T62 20 T82 20 T102 20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function CurvedArrow({ className, style, color = "#111", size = 70 }: DoodleProps) {
  return (
    <svg className={className} style={style} width={size} height={size} viewBox="0 0 80 80" fill="none">
      <path
        d="M8 12 C 30 8, 60 18, 64 50"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="1 5"
      />
      <path d="M58 42 L66 52 L54 56" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Ribbon({ className, style, color = "#F5B3CB", label = "Handmade" }: DoodleProps & { label?: string }) {
  return (
    <div
      className={className}
      style={{
        background: color,
        border: "1.5px solid #111",
        boxShadow: "3px 3px 0 #111",
        borderRadius: "9999px",
        padding: "6px 16px",
        fontFamily: "var(--font-script)",
        color: "#111",
        fontSize: "1.05rem",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {label}
    </div>
  );
}

type YarnBallProps = DoodleProps & { animated?: boolean };

export function YarnBall({
  className,
  style,
  color = "#F5B3CB",
  size = 90,
  animated = true,
}: YarnBallProps) {
  const uid = useId().replace(/:/g, "");
  const ballGrad = `yarn-ball-${uid}`;
  const threadGrad = `yarn-thread-${uid}`;
  const shineGrad = `yarn-shine-${uid}`;
  const clipBall = `yarn-clip-${uid}`;

  const Svg = animated ? motion.svg : "svg";
  const motionProps = animated
    ? {
        animate: { rotate: 360 },
        transition: { duration: 30, repeat: Infinity, ease: "linear" as const },
      }
    : {};

  return (
    <Svg
      className={className}
      style={style}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      {...motionProps}
    >
      <defs>
        <radialGradient id={ballGrad} cx="34%" cy="28%" r="68%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.72" />
          <stop offset="38%" stopColor={color} stopOpacity="1" />
          <stop offset="78%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.82" />
        </radialGradient>
        <linearGradient id={threadGrad} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
          <stop offset="50%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor="#111111" stopOpacity="0.12" />
        </linearGradient>
        <radialGradient id={shineGrad} cx="28%" cy="22%" r="32%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.82" />
          <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <clipPath id={clipBall}>
          <circle cx="58" cy="54" r="37" />
        </clipPath>
      </defs>

      {/* Yarn tail — loose strands trailing behind the ball */}
      <g strokeLinecap="round" fill="none">
        <path
          d="M82 72 C90 78, 98 84, 104 92 C108 98, 110 104, 106 110 C102 116, 94 114, 96 106"
          stroke="#111"
          strokeWidth="2.2"
        />
        <path
          d="M86 76 C94 82, 102 90, 108 98 C112 104, 112 110, 108 114"
          stroke="#111"
          strokeWidth="1.6"
          opacity="0.55"
        />
        <path
          d="M78 78 C86 86, 94 94, 100 102 C104 108, 104 112, 100 116"
          stroke="#111"
          strokeWidth="1.4"
          opacity="0.4"
        />
        <path
          d="M90 80 C96 86, 102 92, 106 98"
          stroke={color}
          strokeWidth="3"
          opacity="0.35"
        />
      </g>

      {/* Soft ground shadow */}
      <ellipse cx="58" cy="92" rx="30" ry="5.5" fill="#111" opacity="0.07" />

      {/* Base sphere volume */}
      <circle cx="58" cy="54" r="37" fill={`url(#${ballGrad})`} />

      {/* Woven yarn wraps — clipped to the ball for a wound-sphere look */}
      <g clipPath={`url(#${clipBall})`} strokeLinecap="round" fill="none">
        {/* Horizontal latitude wraps */}
        <g stroke="#111">
          <path d="M22 38 C38 18, 78 18, 94 38" strokeWidth="2.1" opacity="0.88" />
          <path d="M20 46 C36 26, 80 26, 96 46" strokeWidth="2" opacity="0.82" />
          <path d="M19 54 C34 36, 82 36, 97 54" strokeWidth="1.95" opacity="0.78" />
          <path d="M20 62 C35 46, 81 46, 96 62" strokeWidth="1.85" opacity="0.72" />
          <path d="M22 70 C38 56, 78 56, 94 70" strokeWidth="1.75" opacity="0.66" />
          <path d="M26 78 C40 66, 76 66, 90 78" strokeWidth="1.65" opacity="0.58" />
          <path d="M30 84 C42 76, 74 76, 86 84" strokeWidth="1.5" opacity="0.5" />
        </g>

        {/* Vertical longitude wraps */}
        <g stroke="#111">
          <path d="M58 18 C78 34, 78 74, 58 90" strokeWidth="2" opacity="0.8" />
          <path d="M50 19 C72 36, 72 72, 50 89" strokeWidth="1.85" opacity="0.72" />
          <path d="M42 21 C66 40, 66 68, 42 87" strokeWidth="1.75" opacity="0.64" />
          <path d="M66 19 C84 38, 84 70, 66 89" strokeWidth="1.85" opacity="0.72" />
          <path d="M74 22 C88 42, 88 66, 74 86" strokeWidth="1.7" opacity="0.58" />
          <path d="M34 23 C52 42, 52 66, 34 85" strokeWidth="1.7" opacity="0.58" />
        </g>

        {/* Diagonal cross-weave bands */}
        <g stroke="#111">
          <path d="M28 28 C48 48, 68 48, 88 28" strokeWidth="1.7" opacity="0.62" />
          <path d="M32 32 C52 50, 64 50, 84 32" strokeWidth="1.55" opacity="0.52" />
          <path d="M28 80 C48 60, 68 60, 88 80" strokeWidth="1.7" opacity="0.62" />
          <path d="M32 76 C52 58, 64 58, 84 76" strokeWidth="1.55" opacity="0.52" />
          <path d="M24 54 C44 34, 72 34, 92 54" strokeWidth="1.6" opacity="0.48" />
          <path d="M24 58 C44 78, 72 78, 92 58" strokeWidth="1.6" opacity="0.48" />
        </g>

        {/* Colored thread fill between wraps for depth */}
        <g stroke={`url(#${threadGrad})`}>
          <path d="M26 42 C42 30, 74 30, 90 42" strokeWidth="4" opacity="0.55" />
          <path d="M26 66 C42 78, 74 78, 90 66" strokeWidth="4" opacity="0.45" />
          <path d="M46 22 C58 42, 58 66, 46 86" strokeWidth="3.5" opacity="0.4" />
          <path d="M70 22 C82 42, 82 66, 70 86" strokeWidth="3.5" opacity="0.4" />
        </g>

        {/* Shadow-side threads (lower-right) */}
        <g stroke="#111">
          <path d="M62 68 C72 62, 82 66, 88 76" strokeWidth="2" opacity="0.42" />
          <path d="M66 72 C74 68, 80 70, 84 78" strokeWidth="1.6" opacity="0.34" />
          <path d="M70 58 C80 54, 86 58, 90 68" strokeWidth="1.5" opacity="0.3" />
          <path d="M58 76 C68 72, 76 74, 82 82" strokeWidth="1.45" opacity="0.28" />
        </g>

        {/* Highlight threads (upper-left) */}
        <g stroke="#FFFFFF">
          <path d="M30 36 C42 28, 54 28, 66 36" strokeWidth="1.4" opacity="0.55" />
          <path d="M28 44 C40 36, 52 36, 64 44" strokeWidth="1.2" opacity="0.42" />
          <path d="M36 26 C44 34, 44 46, 36 54" strokeWidth="1.1" opacity="0.38" />
        </g>
      </g>

      {/* Surface shine */}
      <ellipse cx="44" cy="40" rx="15" ry="10" fill={`url(#${shineGrad})`} />

      {/* Bold outer outline */}
      <circle cx="58" cy="54" r="37" stroke="#111" strokeWidth="2.5" />

      {/* Strand connecting ball surface to tail */}
      <path
        d="M76 66 C80 70, 84 74, 88 78"
        stroke="#111"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M74 68 C78 72, 82 76, 86 80"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.45"
      />
    </Svg>
  );
}

export function Cloud({ className, style, color = "#FFFFFF", size = 100 }: DoodleProps) {
  return (
    <svg className={className} style={style} width={size} height={size * 0.6} viewBox="0 0 100 60" fill="none">
      <path
        d="M20 45 C8 45 8 28 22 28 C22 16 42 14 46 26 C52 18 70 22 70 34 C82 32 86 48 74 50 L24 50 C20 50 18 48 20 45Z"
        fill={color}
        stroke="#111"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
