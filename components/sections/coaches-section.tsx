"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
import { fadeUp } from "@/lib/motion";
import {
  FloatingShape,
  KineticArc,
  KettlebellShape,
} from "@/components/motion/gym-shapes";
import { SplitText } from "@/components/motion/split-text";
import { Magnetic } from "@/components/motion/magnetic";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  { key: "profile", icon: BadgeCheck },
  { key: "jobs", icon: Briefcase },
  { key: "clients", icon: Users },
  { key: "tools", icon: MessagesSquare },
] as const;

export function CoachesSection() {
  const t = useTranslations("Coaches");
  const locale = useLocale();

  const featuresRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = featuresRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const cards = el.querySelectorAll(".reveal-item");
    if (!cards.length) return;

    // Apply scroll zoom magnifying lens to each card
    cards.forEach((card) => {
      gsap.fromTo(
        card,
        { scale: 0.88, opacity: 0.4 },
        {
          scale: 1.0,
          opacity: 1.0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 95%",
            end: "center 65%",
            scrub: true,
            toggleActions: "play reverse play reverse",
          },
        }
      );
    });
  }, { scope: featuresRef });

  return (
    <section
      id="coaches"
      className="relative scroll-mt-24 overflow-hidden px-4 py-14 sm:px-6"
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
        <SplitText
          as="h2"
          text={t("title")}
          className="mx-auto mt-7 max-w-3xl text-4xl font-black leading-[1.04] tracking-tight sm:text-5xl md:text-6xl text-foreground"
          delay={0.05}
        />
        <SplitText
          as="p"
          text={t("description")}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-foreground/60"
          delay={0.1}
        />
      </div>

      <div className="relative z-10 mx-auto mt-10 max-w-5xl">
        <VideoFrame src="/videos/coaches.mp4" caption={t("videoCaption")} />
      </div>

      <div
        ref={featuresRef}
        className="relative z-10 mx-auto mt-10 grid max-w-3xl gap-x-10 gap-y-12 sm:grid-cols-2"
      >
        {FEATURES.map(({ key, icon }) => (
          <FeatureCard
            key={key}
            icon={icon}
            title={t(`features.${key}.title`)}
            desc={t(`features.${key}.desc`)}
          />
        ))}
      </div>

      <Reveal
        variants={fadeUp}
        delay={0.1}
        className="relative z-10 mt-10 flex justify-center"
      >
        <Magnetic>
          <a href={appUrl("/coaches", locale)}>
            <Button variant="primary" size="lg">
              {t("cta")}
              <ArrowRight className="rtl:rotate-180" />
            </Button>
          </a>
        </Magnetic>
      </Reveal>
    </section>
  );
}
