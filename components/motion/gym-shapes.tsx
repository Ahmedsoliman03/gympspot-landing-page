"use client";

import { memo, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/* -------------------------------------------------------------------------- */
/*  Equipment silhouettes                                                     */
/*                               -------------------------------------------- */

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
  /** Ambient bob amplitude (px). */
  float?: number;
  /** Ambient rotation sway (deg). */
  sway?: number;
  /** If true, the shape rotates continuously. */
  spin?: boolean;
  /** Seconds for one ambient cycle. */
  duration?: number;
  /** Start offset (s) so multiple shapes don't bob in lockstep. */
  delay?: number;
}

/**
 * Wraps a decorative shape with two independent transforms:
 *   • outer element parallax-scrolls via GSAP ScrollTrigger (scrubbed)
 *   • inner element runs a looping ambient float or continuous spin via GSAP
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
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return;
    }

    // 1. Parallax scroll effect on the outer container
    gsap.fromTo(
      outer,
      { y: parallax },
      {
        y: -parallax,
        ease: "none",
        scrollTrigger: {
          trigger: outer,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );

    // 2. Ambient looping animation on the inner container
    if (spin) {
      gsap.to(inner, {
        rotate: 360,
        duration: duration * 3,
        repeat: -1,
        ease: "none",
      });
    } else {
      // Gentle float + rotation sway
      gsap.fromTo(
        inner,
        { y: 0, rotate: -sway },
        {
          y: -float,
          rotate: sway,
          duration: duration / 2,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          delay,
        }
      );
    }
  }, { scope: outerRef, dependencies: [parallax, float, sway, spin, duration, delay] });

  return (
    <div
      ref={outerRef}
      aria-hidden
      className={cn("pointer-events-none absolute -z-10", className)}
    >
      <div ref={innerRef}>
        {children}
      </div>
    </div>
  );
};

export const FloatingShape = memo(FloatingShapeBase);

/* -------------------------------------------------------------------------- */
/*  KineticArc — a motion/energy line that draws itself on scroll-in          */
/* -------------------------------------------------------------------------- */

interface KineticArcProps {
  className?: string;
  /** Custom SVG path. */
  d?: string;
  /** viewBox; match it to your `d`. */
  viewBox?: string;
  /** Delay (s) before the stroke begins drawing. */
  delay?: number;
}

const DEFAULT_ARC = "M4 96C40 96 56 8 116 8";

/**
 * A single sweeping stroke that "draws" itself the first time it scrolls into view
 * using standard SVG stroke-dash properties driven by GSAP and ScrollTrigger.
 */
const KineticArcBase = ({
  className,
  d = DEFAULT_ARC,
  viewBox = "0 0 120 100",
  delay = 0,
}: KineticArcProps) => {
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(() => {
    const path = pathRef.current;
    if (!path) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      gsap.set(path, { opacity: 1, strokeDashoffset: 0 });
      return;
    }

    const length = path.getTotalLength();

    // Initialize SVG dash properties
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
      opacity: 0,
    });

    // Draw animation when entering viewport
    gsap.to(path, {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 1.4,
      ease: "power2.out",
      delay,
      scrollTrigger: {
        trigger: path,
        start: "top 85%",
        toggleActions: "play none none none",
        once: true,
      },
    });
  }, { dependencies: [d, delay] });

  return (
    <svg
      aria-hidden
      viewBox={viewBox}
      fill="none"
      className={cn("pointer-events-none absolute -z-10", className)}
    >
      <path
        ref={pathRef}
        d={d}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
};

export const KineticArc = memo(KineticArcBase);
