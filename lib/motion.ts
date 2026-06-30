import type { Variants, Transition } from "framer-motion";

/**
 * Shared animation tokens.
 *
 * PERFORMANCE NOTE: every variant/transition object below is defined once at
 * module scope, so it keeps a stable identity across every render. Passing the
 * same object reference to <motion.*> lets Framer Motion skip re-evaluating the
 * animation, and avoids re-creating literals on each render. Animate ONLY
 * `opacity` and `transform` (x/y/scale) — both are GPU-composited and never
 * trigger layout/paint, which keeps scroll buttery even with many elements.
 */

export const EASE_OUT: Transition["ease"] = [0.22, 1, 0.36, 1];

export const transition: Transition = {
  duration: 0.6,
  ease: EASE_OUT,
};

/** Fade + rise. The default reveal-on-scroll. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition },
};

/** Fade + small scale — good for media / cards. */
export const fadeScale: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition },
};

/**
 * Richer reveal: rise + settle with a subtle scale. A touch more energetic than
 * `fadeUp` for hero/section headlines. Still GPU-only (opacity + transform).
 */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

/**
 * Plate spin-in — for circular gym shapes (weight plates). Rotates and scales
 * into place like a plate settling onto a bar. Transform-only.
 */
export const plateIn: Variants = {
  hidden: { opacity: 0, scale: 0.6, rotate: -120 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.9, ease: EASE_OUT },
  },
};

/**
 * Kinetic line "draw": animates an SVG stroke from 0 → full length via
 * `pathLength`. Use on a <m.path> to sketch a motion/energy arc on scroll-in.
 */
export const drawArc: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1.4, ease: EASE_OUT },
  },
};

/** Slide in from the inline-start side (flips automatically in RTL via x sign). */
export const fadeInX = (from: number = -32): Variants => ({
  hidden: { opacity: 0, x: from },
  visible: { opacity: 1, x: 0, transition },
});

/** Parent that staggers its children's `visible` state. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

/** Child item for use inside a staggerContainer. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition },
};

/** Reduced-motion fallback: appear with no movement. */
export const reducedReveal: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

/** Shared viewport config so animations run once and don't re-fire on scroll. */
export const VIEWPORT = { once: true, amount: 0.25 } as const;
