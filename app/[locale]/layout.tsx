import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { GeistSans } from "geist/font/sans";
import { Almarai } from "next/font/google";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { MotionProvider } from "@/components/motion/motion-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "../globals.css";

const almarai = Almarai({

  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
  variable: "--font-almarai",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  const title = t("title");
  const description = t("description");

  const ogImage = {
    url: "/images/Gymspot-logo.png",
    width: 2000,
    height: 2000,
    alt: "GymSpot",
  };

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    applicationName: "GymSpot",
    // Browser-tab / bookmark icon.
    icons: {
      icon: "/images/Gymspot-logo.png",
      shortcut: "/images/Gymspot-logo.png",
      apple: "/images/Gymspot-logo.png",
    },
    // Preview card shown when the link is shared (Facebook, WhatsApp, etc.).
    openGraph: {
      type: "website",
      siteName: "GymSpot",
      title,
      description,
      url: `/${locale}`,
      locale: locale === "ar" ? "ar_AR" : "en_US",
      images: [ogImage],
    },
    // "summary" shows the full square logo; "summary_large_image" would crop it.
    twitter: {
      card: "summary",
      title,
      description,
      images: [ogImage],
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "ar")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
      className={`${GeistSans.variable} ${almarai.variable}`}
    >
      <body className="font-sans antialiased selection:bg-primary/30">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            forcedTheme="dark"
            disableTransitionOnChange
          >
            <MotionProvider>
              <Navbar />
              <main>{children}</main>
              <Footer />
            </MotionProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
