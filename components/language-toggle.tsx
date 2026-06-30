"use client";

import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";

/** Switches between en/ar while preserving the current path, query, and hash. */
export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "ar" : "en";
    const search = typeof window !== "undefined" ? window.location.search : "";
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    router.replace(`${pathname}${search}${hash}`, { locale: nextLocale });
  };

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 text-foreground/50 hover:text-primary hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10 flex items-center gap-1.5"
      aria-label="Switch language"
    >
      <Globe size={18} />
      <span className="text-xs font-black uppercase">
        {locale === "en" ? "AR" : "EN"}
      </span>
    </button>
  );
}
