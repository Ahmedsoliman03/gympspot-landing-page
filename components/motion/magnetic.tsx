"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

interface MagneticProps {
  children: React.ReactElement;
}

/**
 * Magnetic wraps an interactive element and pulls it gently towards the user's cursor
 * when hovered, snapping back with a premium elastic bounce on mouse leave.
 */
export function Magnetic({ children }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const child = el.firstElementChild as HTMLElement;
    if (!child) return;

    // Use elastic ease for responsive, tactile snap-back feedback
    const xTo = gsap.quickTo(child, "x", { duration: 0.8, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(child, "y", { duration: 0.8, ease: "elastic.out(1, 0.3)" });

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = el.getBoundingClientRect();

      const centerX = left + width / 2;
      const centerY = top + height / 2;

      // Mouse distance from center of element
      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;

      // Pull element by a fraction of mouse delta
      xTo(deltaX * 0.35);
      yTo(deltaY * 0.35);
    };

    const onMouseLeave = () => {
      // Elastic snap back to origin
      xTo(0);
      yTo(0);
    };

    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);

    return () => {
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
    };
  }, { scope: ref });

  return (
    <div ref={ref} className="inline-block">
      {children}
    </div>
  );
}
