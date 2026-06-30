"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { BrandLogo } from "./brand-logo";
import { LanguageToggle } from "./language-toggle";
import { Button } from "./ui/button";
import { appUrl, cn } from "@/lib/utils";

const SECTIONS = ["gyms", "coaches", "clients"] as const;

export function Navbar() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={cn(
          "fixed inset-x-0 top-0 z-[100] px-4 py-3 transition-all duration-300 sm:px-6 md:px-12 sm:py-4",
          scrolled
            ? "bg-background/80 shadow-2xl shadow-black/50 backdrop-blur-xl"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <BrandLogo />

          <div className="hidden items-center gap-8 md:flex">
            {SECTIONS.map((s) => (
              <a
                key={s}
                href={`#${s}`}
                className="text-sm font-bold uppercase text-foreground/60 transition-colors hover:text-primary"
              >
                {t(s)}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            
            
            <a href={appUrl("/", locale)} className="hidden sm:block">
              <Button variant="primary" size="sm">
                {t("getStarted")}
              </Button>
            </a>

            <button
              className={cn(
                "rounded-xl p-2.5 transition-all md:hidden",
                open
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/50 hover:bg-white/5 hover:text-foreground"
              )}
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-[99] flex flex-col bg-background/95 px-6 pb-8 pt-24 backdrop-blur-2xl transition-all duration-300 md:hidden",
          open
            ? "translate-x-0 opacity-100"
            : "pointer-events-none translate-x-full opacity-0"
        )}
      >
        <div className="flex flex-col gap-6">
          {SECTIONS.map((s) => (
            <a
              key={s}
              href={`#${s}`}
              onClick={() => setOpen(false)}
              className="text-2xl font-black uppercase text-foreground/70 transition-colors hover:text-primary"
            >
              {t(s)}
            </a>
          ))}
        </div>
        <div className="mt-auto flex flex-col gap-3">
          <a href={appUrl("/login", locale)}>
            <Button variant="secondary" size="lg" className="w-full">
              {t("signIn")}
            </Button>
          </a>
          <a href={appUrl("/", locale)}>
            <Button variant="primary" size="lg" className="w-full">
              {t("getStarted")}
            </Button>
          </a>
        </div>
      </div>
    </>
  );
}
