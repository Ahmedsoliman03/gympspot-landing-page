"use client";

import { memo, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Animation variants with hidden and visible states. */
  variants?: {
    hidden: Record<string, any>;
    visible: Record<string, any>;
  };
  /** Delay in seconds before animation triggers. */
  delay?: number;
  /** Render element tag. Defaults to div. */
  as?: "div" | "section" | "li" | "span" | "ul" | "h2" | "p";
}

/**
 * Reveal-on-scroll wrapper using GSAP ScrollTrigger.
 * Plays its entrance animation once when scrolled into view.
 */
const RevealBase = ({
  children,
  className,
  variants = fadeUp,
  delay = 0,
  as = "div",
}: RevealProps) => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // On reduced motion, element is already visible — nothing to do
    if (prefersReducedMotion) return;

    const { hidden, visible } = variants;

    // Hide AFTER React renders (prevents blank flash from SSR opacity:0)
    gsap.set(el, hidden);

    // Animates when visible in viewport
    gsap.to(el, {
      ...visible,
      delay,
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
        once: true,
      },
    });
  }, { scope: containerRef, dependencies: [variants, delay] });

  const Tag = as;

  return (
    <Tag ref={containerRef as any} className={cn(className)}>
      {children}
    </Tag>
  );
};

export const Reveal = memo(RevealBase);
