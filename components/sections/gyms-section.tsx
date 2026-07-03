"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  BarChart3,
  Search,
  BadgeDollarSign,
  UserPlus,
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
  PlateShape,
} from "@/components/motion/gym-shapes";
import { SplitText } from "@/components/motion/split-text";
import { Magnetic } from "@/components/motion/magnetic";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  { key: "visibility", icon: Search },
  { key: "memberships", icon: BadgeDollarSign },
  { key: "hiring", icon: UserPlus },
  { key: "insights", icon: BarChart3 },
] as const;

export function GymsSection() {
  const t = useTranslations("Gyms");
  const locale = useLocale();

  const sectionRef = useRef<HTMLDivElement>(null);
  const zoomTrackRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const zoomTrack = zoomTrackRef.current;
    const videoWrapper = videoWrapperRef.current;
    if (!zoomTrack || !videoWrapper) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Viewport Pinned Video Zoom-Out effect
    gsap.fromTo(
      videoWrapper,
      { scale: 1.35, borderRadius: "0px" },
      {
        scale: 1.0,
        borderRadius: "24px",
        ease: "none",
        scrollTrigger: {
          trigger: zoomTrack,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          pin: true,
          pinSpacing: true,
        },
      }
    );
  }, { scope: sectionRef });

  useGSAP(() => {
    const el = featuresRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const cards = el.querySelectorAll(".reveal-item");
    if (!cards.length) return;

    // Set initial states
    gsap.set(cards, { opacity: 0, y: 20 });

    // Animate and stagger features on scroll
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.1,
      clearProps: "transform",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
        once: true,
      },
    });
  }, { scope: featuresRef });

  return (
    <section
      ref={sectionRef}
      id="gyms"
      className="relative scroll-mt-24 overflow-hidden py-14 px-4 sm:px-6 md:py-24"
    >
      {/* Sparse gym motif */}
      <FloatingShape
        className="-end-10 top-10 z-0 hidden w-48 text-primary/[0.05] xl:block"
        spin
        parallax={70}
      >
        <PlateShape className="h-full w-full" />
      </FloatingShape>
      <KineticArc className="bottom-12 start-[4%] z-0 hidden w-24 text-primary/15 lg:block" />

      {/* 1. Header (Scrolls normally) */}
      <div className="relative z-10 mx-auto max-w-3xl text-center mb-10">
        <Reveal className="flex justify-center">
          <SectionLabel index="01">{t("label")}</SectionLabel>
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

      {/* 2. Zoom Track (Pins viewport and zooms out video) */}
      <div ref={zoomTrackRef} className="relative z-10 w-full h-[120vh] mb-10">
        <div className="sticky top-0 left-0 flex h-screen w-full items-center justify-center overflow-hidden">
          <div className="relative w-full max-w-5xl aspect-video overflow-hidden rounded-3xl">
            <div ref={videoWrapperRef} className="w-full h-full origin-center overflow-hidden">
              <VideoFrame src="/videos/gyms.mp4" caption={t("videoCaption")} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Features & CTA (Scrolls up naturally below video) */}
      <div
        ref={featuresRef}
        className="relative z-10 mx-auto max-w-3xl flex flex-col items-center"
      >
        <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 w-full">
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
          className="mt-10 flex justify-center w-full"
        >
          <Magnetic>
            <a href={appUrl("/gyms", locale)}>
              <Button variant="primary" size="lg">
                {t("cta")}
                <ArrowRight className="rtl:rotate-180" />
              </Button>
            </a>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
