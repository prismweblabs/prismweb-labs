"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import { motion } from "motion/react";

/**
 * Text hover effect (Aceternity UI style): outlined SVG text that reveals a
 * gradient stroke under the cursor. Re-created locally because the registry
 * host was unreachable from the build sandbox.
 */
export const TextHoverEffect = ({
  text,
  duration,
  fontSize = 44,
}: {
  text: string;
  duration?: number;
  fontSize?: number;
}) => {
  const uid = useId().replace(/:/g, "");
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (svgRef.current) {
      const r = svgRef.current.getBoundingClientRect();
      setMaskPosition({
        cx: `${((cursor.x - r.left) / r.width) * 100}%`,
        cy: `${((cursor.y - r.top) / r.height) * 100}%`,
      });
    }
  }, [cursor]);

  const textProps = {
    x: "50%",
    y: "50%",
    textAnchor: "middle" as const,
    dominantBaseline: "middle" as const,
    strokeWidth: "0.3",
    fontSize,
    fontWeight: 700,
    fontFamily: "var(--font-geist-sans), Helvetica, sans-serif",
    fill: "transparent",
  };

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className="select-none"
      aria-label={text}
      role="img"
    >
      <defs>
        <linearGradient id={`grad-${uid}`} gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="100%" y2="0%">
          {hovered && (
            <>
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="35%" stopColor="#22d3ee" />
              <stop offset="70%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#a78bfa" />
            </>
          )}
        </linearGradient>
        <motion.radialGradient
          id={`reveal-${uid}`}
          gradientUnits="userSpaceOnUse"
          r="20%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id={`mask-${uid}`}>
          <rect x="0" y="0" width="100%" height="100%" fill={`url(#reveal-${uid})`} />
        </mask>
      </defs>
      <text {...textProps} stroke="rgba(255,255,255,0.25)" style={{ opacity: hovered ? 0.7 : 0, transition: "opacity .3s" }}>
        {text}
      </text>
      <motion.text
        {...textProps}
        stroke="rgba(255,255,255,0.35)"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{ strokeDashoffset: 0, strokeDasharray: 1000 }}
        transition={{ duration: 4, ease: "easeInOut" }}
      >
        {text}
      </motion.text>
      <text {...textProps} stroke={`url(#grad-${uid})`} mask={`url(#mask-${uid})`}>
        {text}
      </text>
    </svg>
  );
};
