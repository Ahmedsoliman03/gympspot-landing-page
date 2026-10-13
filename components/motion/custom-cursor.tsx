"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * Custom lagging cursor using GSAP quickTo.
 * Adapts to hover states like data-cursor="play" or data-cursor="join" for rich agency aesthetics.
 */
export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [cursorText, setCursorText] = useState("");
  const [cursorType, setCursorType] = useState<"default" | "play" | "join" | "hover">("default");
  const [isVisible, setIsVisible] = useState(false);

  useGSAP(() => {
    // Hide custom cursor on mobile / touch devices
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) return;

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    // quickTo is highly optimized for animation loops mapping to mouse moves
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.45, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.45, ease: "power3" });

    const dotXTo = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3" });
    const dotYTo = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3" });

    const onMouseMove = (e: MouseEvent) => {
      // Use functional updater to avoid stale closure without re-registering listeners
      setIsVisible((prev) => { if (!prev) return true; return prev; });

      xTo(e.clientX);
      yTo(e.clientY);

      dotXTo(e.clientX);
      dotYTo(e.clientY);
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    // Contextual hover trigger based on data-cursor tags
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const interactive = target.closest("[data-cursor], a, button");
      if (interactive) {
        const type = interactive.getAttribute("data-cursor");
        if (type === "play") {
          setCursorType("play");
          setCursorText("PLAY");
        } else if (type === "join") {
          setCursorType("join");
          setCursorText("JOIN");
        } else {
          setCursorType("hover");
          setCursorText("");
        }
      } else {
        setCursorType("default");
        setCursorText("");
      }
    };

    window.addEventListener("mouseover", onMouseOver);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      window.removeEventListener("mouseover", onMouseOver);
    };
  // Empty deps: register event listeners once only on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isVisible) return null;

  const isPlayOrJoin = cursorType === "play" || cursorType === "join";

  return (
    <>
      {/* Inner precise dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary mix-blend-difference"
      />
      {/* Outer lagging ring */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-primary/30 text-[9px] font-black tracking-widest text-primary-foreground transition-all duration-300 ease-out"
        style={{
          width: isPlayOrJoin ? "70px" : cursorType === "hover" ? "36px" : "20px",
          height: isPlayOrJoin ? "70px" : cursorType === "hover" ? "36px" : "20px",
          backgroundColor: cursorType === "play" ? "var(--primary)" : cursorType === "join" ? "var(--primary)" : "transparent",
          borderColor: isPlayOrJoin ? "transparent" : "var(--primary)",
        }}
      >
        {isPlayOrJoin && (
          <span className="text-[9px] font-black uppercase text-black tracking-widest animate-pulse">
            {cursorText}
          </span>
        )}
      </div>
    </>
  );
}
