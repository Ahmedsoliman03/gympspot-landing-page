"use client";

import { m } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Users,
  MessagesSquare,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { VideoFrame } from "@/components/video-frame";
import { SectionLabel } from "./section-label";
import { FeatureCard } from "./feature-card";
import { appUrl } from "@/lib/utils";
import { fadeUp, riseIn, staggerContainer, VIEWPORT } from "@/lib/motion";
import {
  FloatingShape,
  KineticArc,
  KettlebellShape,
} from "@/components/motion/gym-shapes";

const FEATURES = [
  { key: "profile", icon: BadgeCheck },
  { key: "jobs", icon: Briefcase },
  { key: "clients", icon: Users },
  { key: "tools", icon: MessagesSquare },
] as const;

export function CoachesSection() {
  const t = useTranslations("Coaches");
  const locale = useLocale();

  return (
    <section
      id="coaches"
      className="relative scroll-mt-24 overflow-hidden px-4 py-28 sm:px-6 md:py-44"
    >
      {/* subtle surface band to alternate rhythm between sections */}
      <div
        aria-hidden
        className="absolute inset-0 bg-surface/30"
      />

      {/* Sparse gym motif */}
      <FloatingShape
        className="-start-8 bottom-12 z-0 hidden w-40 text-primary/[0.06] xl:block"
        parallax={60}
        float={16}
        sway={8}
        duration={12}
      >
        <KettlebellShape className="h-full w-full" />
      </FloatingShape>
      <KineticArc
        className="end-[5%] top-16 z-0 hidden w-24 rotate-180 text-primary/15 lg:block"
        delay={0.2}
      />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <Reveal className="flex justify-center">
          <SectionLabel index="02">{t("label")}</SectionLabel>
        </Reveal>
        <Reveal variants={riseIn} delay={0.05}>
          <h2 className="mx-auto mt-7 max-w-3xl text-4xl font-black leading-[1.04] tracking-tight sm:text-5xl md:text-6xl">
            {t("title")}
          </h2>
        </Reveal>
        <Reveal variants={fadeUp} delay={0.1}>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-foreground/60">
            {t("description")}
          </p>
        </Reveal>
      </div>

      <div className="relative z-10 mx-auto mt-14 max-w-5xl">
        <VideoFrame src="/videos/coaches.mp4" caption={t("videoCaption")} />
      </div>

      <m.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="relative z-10 mx-auto mt-16 grid max-w-3xl gap-x-10 gap-y-12 sm:grid-cols-2"
      >
        {FEATURES.map(({ key, icon }) => (
          <FeatureCard
            key={key}
            icon={icon}
            title={t(`features.${key}.title`)}
            desc={t(`features.${key}.desc`)}
          />
        ))}
      </m.div>

      <Reveal
        variants={fadeUp}
        delay={0.1}
        className="relative z-10 mt-12 flex justify-center"
      >
        <a href={appUrl("/coaches", locale)}>
          <Button variant="primary" size="lg">
            {t("cta")}
            <ArrowRight className="rtl:rotate-180" />
          </Button>
        </a>
      </Reveal>
    </section>
  );
}
