"use client";

import { memo, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface CountUpProps {
  to: number;
  suffix?: string;
  prefix?: string;
  /** Seconds for the count animation. */
  duration?: number;
  /** Formats the live number. Defaults to a thousands-separated integer. */
  format?: (value: number) => string;
  className?: string;
}

const defaultFormat = (v: number) => Math.round(v).toLocaleString("en-US");

/**
 * Counts from 0 → `to` the first time it scrolls into view using GSAP.
 * Writes the text directly onto the DOM node's `textContent` for performance.
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
  const finalText = `${prefix}${format(to)}${suffix}`;

  useGSAP(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      node.textContent = finalText;
      return;
    }

    const obj = { value: 0 };
    gsap.to(obj, {
      value: to,
      duration,
      ease: EASE_OUT,
      scrollTrigger: {
        trigger: node,
        start: "top 85%",
        toggleActions: "play none none none",
        once: true,
      },
      onUpdate: () => {
        node.textContent = `${prefix}${format(obj.value)}${suffix}`;
      },
    });
  }, { scope: ref, dependencies: [to, duration, prefix, suffix, format, finalText] });

  return (
    <span ref={ref} className={cn(className)} aria-label={finalText}>
      {/* Pre-animation / no-JS state. */}
      {`${prefix}${format(0)}${suffix}`}
    </span>
  );
};

export const CountUp = memo(CountUpBase);
