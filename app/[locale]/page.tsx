import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/sections/hero-section";
import { GymsSection } from "@/components/sections/gyms-section";
import { CoachesSection } from "@/components/sections/coaches-section";
import { ClientsSection } from "@/components/sections/clients-section";
import { CtaSection } from "@/components/sections/cta-section";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Enable static rendering for this locale.
  setRequestLocale(locale);

  return (
    <>
      {/* 1 — About GymSpot */}
      <HeroSection />
      {/* 2 — Gyms */}
      <GymsSection />
      {/* 3 — Coaches: features + video + button to coaches */}
      <CoachesSection />
      {/* 4 — Clients */}
      <ClientsSection />
      {/* 5 — Final CTA into the system */}
      <CtaSection />
    </>
  );
}
