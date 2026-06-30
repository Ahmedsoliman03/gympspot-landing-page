"use client";

import { m } from "framer-motion";
import { ArrowRight, Compass, Target, MessageCircle } from "lucide-react";
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
  DumbbellShape,
} from "@/components/motion/gym-shapes";

const FEATURES = [
  { key: "discover", icon: Compass },
  { key: "match", icon: Target },
  { key: "connect", icon: MessageCircle },
] as const;

export function ClientsSection() {
  const t = useTranslations("Clients");
  const locale = useLocale();

  return (
    <section
      id="clients"
      className="relative scroll-mt-24 overflow-hidden px-4 py-28 sm:px-6 md:py-44"
    >
      {/* Sparse gym motif */}
      <FloatingShape
        className="-end-6 top-16 z-0 hidden w-44 text-primary/[0.05] xl:block"
        parallax={65}
        float={15}
        sway={9}
        duration={11}
      >
        <DumbbellShape className="h-full w-full" />
      </FloatingShape>
      <KineticArc className="-start-2 bottom-24 z-0 hidden w-24 text-primary/12 lg:block" />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <Reveal className="flex justify-center">
          <SectionLabel index="03">{t("label")}</SectionLabel>
        </Reveal>
        <Reveal variants={riseIn} delay={0.05}>
          <h2 className="mx-auto mt-7 max-w-4xl text-4xl font-black leading-[1.04] tracking-tight sm:text-5xl md:text-6xl">
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
        <VideoFrame src="/videos/clients.mp4" caption={t("videoCaption")} />
      </div>

      <m.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="relative z-10 mx-auto mt-16 grid max-w-5xl gap-x-10 gap-y-12 sm:grid-cols-3"
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
        <a href={appUrl("/", locale)}>
          <Button variant="primary" size="lg">
            {t("cta")}
            <ArrowRight className="rtl:rotate-180" />
          </Button>
        </a>
      </Reveal>
    </section>
  );
}
