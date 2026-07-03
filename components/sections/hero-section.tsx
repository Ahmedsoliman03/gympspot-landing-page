"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { appUrl } from "@/lib/utils";
import {
  FloatingShape,
  KineticArc,
  PlateShape,
  DumbbellShape,
  BarbellShape,
} from "@/components/motion/gym-shapes";
import { CountUp } from "@/components/motion/count-up";
import { SplitText } from "@/components/motion/split-text";
import { Magnetic } from "@/components/motion/magnetic";

/**
 * Stats counted up on scroll.
 */
const STATS = [
  { key: "gyms", to: 500, suffix: "+" },
  { key: "coaches", to: 2000, suffix: "+" },
  { key: "clients", to: 50, suffix: "K+" },
] as const;

export function HeroSection() {
  const t = useTranslations("Hero");
  const locale = useLocale();

  const containerRef = useRef<HTMLDivElement>(null);
  const sparklesRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return;
    }

    const badge = container.querySelector(".hero-badge");
    const ctas = container.querySelector(".hero-ctas");
    const stats = container.querySelector(".hero-stats");

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    // 1. Badge entry
    tl.fromTo(badge, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 }
    );

    // 2. CTAs entry (delayed slightly after title reveal)
    tl.fromTo(ctas,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      "+=0.4"
    );

    // 3. Stats container entry
    tl.fromTo(stats,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.6 },
      "-=0.2"
    );

    // 4. Sparkles ambient scale + rotation
    const sparkles = sparklesRef.current;
    if (sparkles) {
      gsap.fromTo(sparkles,
        { scale: 1, rotate: 0 },
        {
          scale: 1.25,
          rotate: 14,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        }
      );
    }
  }, { scope: containerRef });

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pb-20 pt-32 sm:px-6">
      {/* Ambient background glows */}
      <div
        aria-hidden
        className="glow-blob animate-glow-drift absolute -top-32 start-1/4 h-[36rem] w-[36rem] rounded-full bg-primary/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="glow-blob animate-glow-drift-slow absolute -bottom-40 end-1/4 h-[32rem] w-[32rem] rounded-full bg-primary/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,var(--background))]"
      />

      {/* Gym-equipment motif — slow parallax + ambient float */}
      <FloatingShape
        className="start-[6%] top-24 z-0 hidden w-44 text-primary/[0.07] sm:block lg:w-56"
        spin
        parallax={90}
      >
        <PlateShape className="h-full w-full" />
      </FloatingShape>
      <FloatingShape
        className="end-[8%] top-28 z-0 hidden w-36 text-primary/[0.08] md:block lg:w-44"
        parallax={70}
        float={18}
        sway={10}
        duration={11}
      >
        <DumbbellShape className="h-full w-full" />
      </FloatingShape>
      <FloatingShape
        className="bottom-24 end-[14%] z-0 hidden w-52 text-primary/[0.06] lg:block"
        parallax={50}
        float={12}
        sway={5}
        duration={13}
        delay={1}
      >
        <BarbellShape className="h-full w-full" />
      </FloatingShape>

      {/* Kinetic momentum lines */}
      <KineticArc className="start-[12%] top-1/3 z-0 hidden w-28 text-primary/25 lg:block" />
      <KineticArc
        className="bottom-1/3 end-[10%] z-0 hidden w-24 rotate-180 text-primary/20 lg:block"
        delay={0.3}
      />

      <div
        ref={containerRef}
        className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center"
      >
        <div className="hero-badge">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-primary">
            <span
              ref={sparklesRef}
              className="inline-flex"
            >
              <Sparkles className="size-4" />
            </span>
            {t("badge")}
          </span>
        </div>

        <h1
          className="hero-title mt-6 text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl md:text-7xl"
        >
          <SplitText text={t("title")} as="span" className="inline mr-3 rtl:ml-3 rtl:mr-0" />
          <SplitText text={t("titleHighlight")} as="span" className="text-gradient-primary inline" delay={0.3} />
        </h1>

        <SplitText
          as="p"
          text={t("subtitle")}
          className="hero-subtitle mt-6 max-w-2xl text-base leading-relaxed text-foreground/60 sm:text-lg"
          delay={0.15}
        />

        <div
          className="hero-ctas mt-9 flex flex-col items-center gap-5 sm:flex-row"
        >
          <Magnetic>
            <a href={appUrl("/", locale)} className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full">
                {t("primaryCta")}
                <ArrowRight className="rtl:rotate-180" />
              </Button>
            </a>
          </Magnetic>
          <Magnetic>
            <a href="#gyms" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full">
                {t("secondaryCta")}
              </Button>
            </a>
          </Magnetic>
        </div>

        {/* Stats */}
        <div
          className="hero-stats mt-16 grid w-full max-w-2xl grid-cols-3 gap-4 border-t border-white/10 pt-10"
        >
          {STATS.map(({ key, to, suffix }) => (
            <div key={key} className="flex flex-col">
              <CountUp
                to={to}
                suffix={suffix}
                className="text-3xl font-black tabular-nums tracking-tight text-primary sm:text-5xl"
              />
              <span className="mt-1 text-[11px] font-bold uppercase tracking-wide text-foreground/50 sm:text-xs">
                {t(`stats.${key}`)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
