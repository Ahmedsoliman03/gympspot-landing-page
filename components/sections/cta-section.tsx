"use client";

import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { appUrl } from "@/lib/utils";
import { fadeUp } from "@/lib/motion";
import { FloatingShape, PlateShape } from "@/components/motion/gym-shapes";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { Magnetic } from "@/components/motion/magnetic";

export function CtaSection() {
  const t = useTranslations("Cta");
  const locale = useLocale();

  return (
    <section className="px-4 pb-14 pt-4 sm:px-6">
      <Reveal
        variants={fadeUp}
        className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-primary/20 bg-surface px-6 py-16 text-center sm:px-12 sm:py-20 cursor-none"
        data-cursor="join"
      >
        {/* Glow accents */}
        <div
          aria-hidden
          className="glow-blob animate-glow-drift absolute -top-24 start-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/25 blur-[100px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.12),transparent_60%)]"
        />

        {/* Two slow plates loading onto the final call to action */}
        <FloatingShape
          className="-start-10 -bottom-10 z-0 hidden w-44 text-primary/[0.07] sm:block"
          spin
          parallax={40}
        >
          <PlateShape className="h-full w-full" />
        </FloatingShape>
        <FloatingShape
          className="-end-12 -top-12 z-0 hidden w-52 text-primary/[0.05] sm:block"
          spin
          parallax={40}
          duration={10}
        >
          <PlateShape className="h-full w-full" />
        </FloatingShape>

        <div
          className="relative z-10 mx-auto flex max-w-2xl flex-col items-center"
        >
          <SplitText
            as="h2"
            text={t("title")}
            className="text-3xl font-black leading-tight sm:text-5xl text-foreground"
            delay={0.05}
          />
          <SplitText
            as="p"
            text={t("subtitle")}
            className="mt-5 text-base leading-relaxed text-foreground/60 sm:text-lg"
            delay={0.1}
          />
          <Reveal
            variants={fadeUp}
            delay={0.2}
            className="mt-9"
          >
            <Magnetic>
              <a href={appUrl("/", locale)}>
                <Button variant="primary" size="lg">
                  {t("button")}
                  <ArrowRight className="rtl:rotate-180" />
                </Button>
              </a>
            </Magnetic>
          </Reveal>
        </div>
      </Reveal>
    </section>
  );
}
