"use client";

import { m } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { appUrl } from "@/lib/utils";
import { fadeUp, riseIn, staggerContainer, staggerItem } from "@/lib/motion";
import {
  FloatingShape,
  KineticArc,
  PlateShape,
  DumbbellShape,
  BarbellShape,
} from "@/components/motion/gym-shapes";
import { CountUp } from "@/components/motion/count-up";

/**
 * Stats counted up on scroll. `to` is the number we animate to; `suffix`
 * carries the magnitude/qualifier so the real figures stay intact:
 *   gyms 500+ · coaches 2,000+ · clients 50K+ (count 0→50 with a "K+" suffix).
 */
const STATS = [
  { key: "gyms", to: 500, suffix: "+" },
  { key: "coaches", to: 2000, suffix: "+" },
  { key: "clients", to: 50, suffix: "K+" },
] as const;

export function HeroSection() {
  const t = useTranslations("Hero");
  const locale = useLocale();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pb-20 pt-32 sm:px-6">
      {/* Ambient background glows — GPU-only transform/opacity animation */}
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

      {/* Gym-equipment motif — slow parallax + ambient float, GPU-only.
          Sits above the background glows but below the z-10 content. */}
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

      {/* Kinetic momentum lines that draw themselves in. */}
      <KineticArc className="start-[12%] top-1/3 z-0 hidden w-28 text-primary/25 lg:block" />
      <KineticArc
        className="bottom-1/3 end-[10%] z-0 hidden w-24 rotate-180 text-primary/20 lg:block"
        delay={0.3}
      />

      <m.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center"
      >
        <m.div variants={staggerItem}>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-primary">
            <m.span
              animate={{ scale: [1, 1.25, 1], rotate: [0, 14, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex"
            >
              <Sparkles className="size-4" />
            </m.span>
            {t("badge")}
          </span>
        </m.div>

        <m.h1
          variants={riseIn}
          className="mt-6 text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl md:text-7xl"
        >
          {t("title")}{" "}
          <span className="text-gradient-primary">{t("titleHighlight")}</span>
        </m.h1>

        <m.p
          variants={staggerItem}
          className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/60 sm:text-lg"
        >
          {t("subtitle")}
        </m.p>

        <m.div
          variants={staggerItem}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <a href={appUrl("/", locale)} className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full">
              {t("primaryCta")}
              <ArrowRight className="rtl:rotate-180" />
            </Button>
          </a>
          <a href="#gyms" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full">
              {t("secondaryCta")}
            </Button>
          </a>
        </m.div>

        {/* Stats */}
        <m.div
          variants={fadeUp}
          className="mt-16 grid w-full max-w-2xl grid-cols-3 gap-4 border-t border-white/10 pt-10"
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
        </m.div>
      </m.div>
    </section>
  );
}
