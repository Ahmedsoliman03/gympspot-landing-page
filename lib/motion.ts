/**
 * Shared animation tokens for GSAP.
 *
 * Animate ONLY `opacity` and `transform` (x/y/scale/rotate) — both are GPU-composited
 * and never trigger layout/paint, which keeps scroll buttery even with many elements.
 */

export const EASE_OUT = "power2.out";

export const transition = {
  duration: 0.6,
  ease: EASE_OUT,
};

/** Fade + rise. The default reveal-on-scroll. */
export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, duration: 0.6, ease: EASE_OUT },
};

/** Fade + small scale — good for media / cards. */
export const fadeScale = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, duration: 0.6, ease: EASE_OUT },
};

/**
 * Richer reveal: rise + settle with a subtle scale.
 */
export const riseIn = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.7,
    ease: EASE_OUT,
  },
};

/**
 * Plate spin-in — for circular gym shapes (weight plates).
 */
export const plateIn = {
  hidden: { opacity: 0, scale: 0.6, rotate: -120 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    duration: 0.9,
    ease: EASE_OUT,
  },
};

/**
 * Kinetic line "draw": animates an SVG stroke.
 */
export const drawArc = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    duration: 1.4,
    ease: EASE_OUT,
  },
};

/** Slide in from the inline-start side. */
export const fadeInX = (from: number = -32) => ({
  hidden: { opacity: 0, x: from },
  visible: { opacity: 1, x: 0, duration: 0.6, ease: EASE_OUT },
});

/** Parent that staggers its children's `visible` state. */
export const staggerContainer = {
  hidden: {},
  visible: {
    stagger: 0.1,
    delay: 0.05,
  },
};

/** Child item for use inside a staggerContainer. */
export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, duration: 0.6, ease: EASE_OUT },
};

/** Reduced-motion fallback: appear with no movement. */
export const reducedReveal = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, duration: 0.2 },
};

/** Shared viewport config for ScrollTrigger triggers. */
export const VIEWPORT = { once: true, amount: 0.25 } as const;
