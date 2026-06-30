"use client";

import { memo, useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface CountUpProps {
  /** Target number to count to. */
  to: number;
  /** Appended after the number, e.g. "+" or "K+". */
  suffix?: string;
  /** Prepended before the number, e.g. "$". */
  prefix?: string;
  /** Seconds for the count animation. */
  duration?: number;
  /** Formats the live number. Defaults to a thousands-separated integer. */
  format?: (value: number) => string;
  className?: string;
}

const defaultFormat = (v: number) => Math.round(v).toLocaleString("en-US");

/**
 * Counts from 0 → `to` the first time it scrolls into view.
 *
 * PERFORMANCE: instead of `setState` on every animation frame (which would
 * re-render the React subtree ~60×/s), we animate a plain number and write the
 * formatted string straight onto the DOM node's `textContent`. React renders
 * once; Framer Motion drives the rest off-thread of the reconciler.
 *
 * Honors reduced-motion (snaps straight to the final value) and exposes the
 * final value via `aria-label` so screen readers announce it once, not on
 * every tick.
 */
const CountUpBase = ({
  to,
  suffix = "",
  prefix = "",
  duration = 1.8,
  format = defaultFormat,
  className,
}: CountUpProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const finalText = `${prefix}${format(to)}${suffix}`;

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return;

    if (reduce) {
      node.textContent = finalText;
      return;
    }

    const controls = animate(0, to, {
      duration,
      ease: EASE_OUT,
      onUpdate: (v) => {
        node.textContent = `${prefix}${format(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduce, to, duration, prefix, suffix, format, finalText]);

  return (
    <span ref={ref} className={cn(className)} aria-label={finalText}>
      {/* Pre-animation / no-JS state. */}
      {`${prefix}${format(0)}${suffix}`}
    </span>
  );
};

export const CountUp = memo(CountUpBase);
