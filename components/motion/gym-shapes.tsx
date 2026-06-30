"use client";

import { memo, useRef, type ReactNode } from "react";
import {
  m,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { drawArc, VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Equipment silhouettes                                                     */
/*                                                                            */
/*  All shapes are stroke-only and use `currentColor`, so a parent's text     */
/*  color + opacity (e.g. `text-primary/[0.07]`) controls how they read. They */
/*  carry no fill, which keeps them feeling like light, premium line-art      */
/*  rather than heavy blocks. `viewBox` is square so sizing is just w/h.      */
/* -------------------------------------------------------------------------- */

type ShapeProps = { className?: string };

/** Weight plate — outer rim, inner hub, and four grip slots. */
export const PlateShape = ({ className }: ShapeProps) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    className={className}
    aria-hidden
  >
    <circle cx="50" cy="50" r="46" />
    <circle cx="50" cy="50" r="14" />
    {[0, 90, 180, 270].map((deg) => (
      <line
        key={deg}
        x1="50"
        y1="18"
        x2="50"
        y2="30"
        transform={`rotate(${deg} 50 50)`}
        strokeLinecap="round"
      />
    ))}
  </svg>
);

/** Dumbbell — a short bar with chunky bells on each end. */
export const DumbbellShape = ({ className }: ShapeProps) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <line x1="34" y1="50" x2="66" y2="50" />
    <rect x="20" y="34" width="12" height="32" rx="3" />
    <rect x="68" y="34" width="12" height="32" rx="3" />
    <rect x="12" y="40" width="8" height="20" rx="3" />
    <rect x="80" y="40" width="8" height="20" rx="3" />
  </svg>
);

/** Barbell — a long bar loaded with plates near both ends. */
export const BarbellShape = ({ className }: ShapeProps) => (
  <svg
    viewBox="0 0 140 60"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <line x1="10" y1="30" x2="130" y2="30" />
    <rect x="34" y="14" width="9" height="32" rx="3" />
    <rect x="24" y="18" width="9" height="24" rx="3" />
    <rect x="97" y="14" width="9" height="32" rx="3" />
    <rect x="107" y="18" width="9" height="24" rx="3" />
  </svg>
);

/** Kettlebell — rounded bell with an open handle. */
export const KettlebellShape = ({ className }: ShapeProps) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <path d="M38 34c0-9 5-16 12-16s12 7 12 16" />
    <path d="M34 40c-6 4-12 14-12 28 0 12 14 18 28 18s28-6 28-18c0-14-6-24-12-28-3-2-9-3-16-3s-13 1-16 3Z" />
  </svg>
);

/* -------------------------------------------------------------------------- */
/*  FloatingShape — parallax + ambient float wrapper                          */
/* -------------------------------------------------------------------------- */

interface FloatingShapeProps {
  children: ReactNode;
  /** Position / size / color utilities, e.g. "start-[8%] top-24 w-40 text-primary/[0.07]". */
  className?: string;
  /** Vertical travel (px) across the scroll range — the parallax depth. */
  parallax?: number;
  /** Ambient bob amplitude (px). Ignored when `spin` is set. */
  float?: number;
  /** Ambient rotation sway (deg). Ignored when `spin` is set. */
  sway?: number;
  /** If true, the shape rotates continuously (great for weight plates). */
  spin?: boolean;
  /** Seconds for one ambient cycle. */
  duration?: number;
  /** Start offset (s) so multiple shapes don't bob in lockstep. */
  delay?: number;
}

/**
 * Wraps a decorative shape with two independent transforms so they never fight:
 *   • the OUTER element parallax-scrolls (driven by the element's own viewport
 *     progress via `useScroll({ target })`), and
 *   • the INNER element runs a looping ambient float/spin.
 *
 * Both are pure transforms (GPU-composited). When the user prefers reduced
 * motion we drop the parallax MotionValue to a constant and skip the loop, so
 * the shape is shown but completely still.
 */
const FloatingShapeBase = ({
  children,
  className,
  parallax = 60,
  float = 14,
  sway = 6,
  spin = false,
  duration = 9,
  delay = 0,
}: FloatingShapeProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Map the element's pass-through-viewport progress to a vertical drift.
  const drift = useTransform(scrollYProgress, [0, 1], [parallax, -parallax]);

  return (
    <m.div
      ref={ref}
      aria-hidden
      style={{ y: reduce ? 0 : drift }}
      className={cn("pointer-events-none absolute -z-10", className)}
    >
      <m.div
        animate={
          reduce
            ? undefined
            : spin
              ? { rotate: 360 }
              : { y: [0, -float, 0], rotate: [-sway, sway, -sway] }
        }
        transition={
          reduce
            ? undefined
            : spin
              ? { duration: duration * 3, repeat: Infinity, ease: "linear" }
              : {
                  duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay,
                }
        }
      >
        {children}
      </m.div>
    </m.div>
  );
};

export const FloatingShape = memo(FloatingShapeBase);

/* -------------------------------------------------------------------------- */
/*  KineticArc — a motion/energy line that draws itself on scroll-in          */
/* -------------------------------------------------------------------------- */

interface KineticArcProps {
  className?: string;
  /** Custom SVG path. Defaults to a swept momentum arc. */
  d?: string;
  /** viewBox; match it to your `d`. */
  viewBox?: string;
  /** Delay (s) before the stroke begins drawing. */
  delay?: number;
}

const DEFAULT_ARC = "M4 96C40 96 56 8 116 8";

/**
 * A single sweeping stroke that "draws" via `pathLength` the first time it
 * scrolls into view — reads as a line of motion / momentum. Color + opacity
 * come from the parent's text color (e.g. `text-primary/30`).
 */
const KineticArcBase = ({
  className,
  d = DEFAULT_ARC,
  viewBox = "0 0 120 100",
  delay = 0,
}: KineticArcProps) => (
  <svg
    aria-hidden
    viewBox={viewBox}
    fill="none"
    className={cn("pointer-events-none absolute -z-10", className)}
  >
    <m.path
      d={d}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      variants={drawArc}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      transition={delay ? { delay } : undefined}
    />
  </svg>
);

export const KineticArc = memo(KineticArcBase);
