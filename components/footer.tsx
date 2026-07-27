import {  useTranslations } from "next-intl";
import { BrandLogo } from "./brand-logo";

export function Footer() {
  const t = useTranslations("Footer");

  const links = [
    { label: t("gyms"), href: "#gyms", external: false },
    { label: t("coaches"), href: "#coaches", external: false },
    { label: t("clients"), href: "#clients", external: false },
  ];

  return (
    <footer className="border-t border-white/10 px-4 py-12 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row md:items-start">
        <div className="flex flex-col items-center gap-3 md:items-start">
          <BrandLogo />
          <p className="max-w-xs text-center text-sm text-foreground/50 md:text-start">
            {t("tagline")}
          </p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              {...(link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="text-sm font-bold uppercase text-foreground/60 transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-white/5 pt-6 text-center text-xs font-bold uppercase tracking-wide text-foreground/40">
        © 2026 GymSpot. {t("rights")}
      </div>
    </footer>
  );
}
