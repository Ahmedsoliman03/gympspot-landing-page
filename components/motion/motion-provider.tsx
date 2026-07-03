"use client";

import { useEffect, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Registers GSAP plugins globally on client-side mount, replacing Framer Motion wrappers.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }
  }, []);

  return <>{children}</>;
}
