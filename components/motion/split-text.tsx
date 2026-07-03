"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface SplitTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  delay?: number;
}

/**
 * SplitText splits text into individual words, wrapping each in a clipping container,
 * and animates them sliding up when they scroll into view.
 */
export function SplitText({ text, className, as = "div", delay = 0 }: SplitTextProps) {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      gsap.set(el.querySelectorAll(".split-word-inner"), { y: 0, opacity: 1 });
      return;
    }

    const words = el.querySelectorAll(".split-word-inner");
    if (!words.length) return;

    gsap.fromTo(
      words,
      { y: "115%", opacity: 0 },
      {
        y: "0%",
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.035,
        delay,
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none none",
          once: true,
        },
      }
    );
  }, { scope: containerRef, dependencies: [text, delay] });

  const Tag = as;
  const wordsArray = text.split(" ");

  return (
    <Tag ref={containerRef as any} className={cn("block", className)}>
      {wordsArray.map((word, wordIndex) => (
        <span
          key={wordIndex}
          className="inline-block overflow-hidden py-[0.1em] mr-[0.25em] rtl:ml-[0.25em] rtl:mr-0 align-middle"
        >
          <span className="split-word-inner inline-block translate-y-full opacity-0">
            {word}
          </span>
        </span>
      ))}
    </Tag>
  );
}
