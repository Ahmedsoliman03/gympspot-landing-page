"use client";

import { LazyMotion, domAnimation, MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Wraps the app in LazyMotion so only the `domAnimation` feature bundle is
 * shipped (instead of the full Framer Motion runtime) — a smaller JS payload
 * and faster hydration. Throughout the app we therefore use the lightweight
 * `m.*` components (from "framer-motion") rather than `motion.*`.
 *
 * MotionConfig with `reducedMotion="user"` makes every animation automatically
 * respect the OS "reduce motion" setting, so we get accessibility for free.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
