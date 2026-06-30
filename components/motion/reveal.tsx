"use client";

import { memo } from "react";
import { m, type Variants } from "framer-motion";
import { fadeUp, VIEWPORT } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Animation variants. Defaults to fadeUp. */
  variants?: Variants;
  /** Delay (s) before the animation starts — handy for manual sequencing. */
  delay?: number;
  /** Render a different element (e.g. "section", "li"). Defaults to div. */
  as?: "div" | "section" | "li" | "span" | "ul" | "h2" | "p";
}

/**
 * Reveal-on-scroll wrapper. Plays its variant once when scrolled into view
 * (`VIEWPORT.once`), so it never re-runs on subsequent scrolls — no wasted work.
 *
 * Memoized with React.memo: since the motion variants are stable module-level
 * objects, identical props mean React skips re-rendering this subtree, which
 * matters when a page has dozens of revealed elements.
 */
const RevealBase = ({
  children,
  className,
  variants = fadeUp,
  delay,
  as = "div",
}: RevealProps) => {
  const MotionTag = m[as];
  return (
    <MotionTag
      className={cn(className)}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </MotionTag>
  );
};

export const Reveal = memo(RevealBase);
