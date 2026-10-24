"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Compass, Target, MessageCircle } from "lucide-react";
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
  DumbbellShape,
} from "@/components/motion/gym-shapes";
import { SplitText } from "@/components/motion/split-text";
import { Magnetic } from "@/components/motion/magnetic";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  { key: "discover", icon: Compass },
  { key: "match", icon: Target },
  { key: "connect", icon: MessageCircle },
] as const;

export function ClientsSection() {
  const t = useTranslations("Clients");
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
      id="clients"
      className="relative scroll-mt-24 overflow-hidden px-4 py-14 sm:px-6 "
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
        <SplitText
          as="h2"
          text={t("title")}
          className="mx-auto mt-7 max-w-4xl text-4xl font-black leading-[1.04] tracking-tight sm:text-5xl md:text-6xl text-foreground"
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
        <VideoFrame src="/videos/clients.mp4" caption={t("videoCaption")} />
      </div>

      <div
        ref={featuresRef}
        className="relative z-10 mx-auto mt-10 grid max-w-5xl gap-x-10 gap-y-12 sm:grid-cols-3"
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
          <a href={appUrl("/", locale)}>
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
