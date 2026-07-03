"use client";

import { memo } from "react";
import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  desc: string;
}

/**
 * One feature tile. Designed to be targeted and staggered by parent containers
 * using GSAP.
 */
const FeatureCardBase = ({ icon: Icon, title, desc }: FeatureCardProps) => (
  <div
    className="reveal-item group h-full rounded-2xl border border-white/10 bg-surface/50 p-6 text-start transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-surface hover:shadow-xl hover:shadow-primary/5"
  >
    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
      <Icon className="size-5" />
    </div>
    <h3 className="mb-2 text-lg font-black tracking-tight">{title}</h3>
    <p className="text-sm leading-relaxed text-foreground/55">{desc}</p>
  </div>
);

export const FeatureCard = memo(FeatureCardBase);
