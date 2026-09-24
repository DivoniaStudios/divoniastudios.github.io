import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Bricolage_Grotesque, Geist, Pixelify_Sans } from "next/font/google";
import "../globals.css";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Motion } from "@/components/Motion";
import { SmoothScroll } from "@/components/SmoothScroll";
import { locales, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SITE_URL } from "@/data/site";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
});

// Piksel yazı yalnızca HUD, etiket ve butonlarda
const pixelify = Pixelify_Sans({
  variable: "--font-pixelify",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0a10" },
    { media: "(prefers-color-scheme: light)", color: "#f5f2f7" },
  ],
  colorScheme: "dark light",
};

/**
 * Tema, sayfa boyanmadan önce seçiliyor: kayıtlı tercih, yoksa sistem
 * ayarı. React yüklenene kadar beklenseydi gündüz tercihli ziyaretçi bir
 * an koyu sayfa görürdü. Anahtar ThemeToggle.tsx'teki THEME_KEY ile aynı.
 */
const themeScript = `(function(){try{var t=localStorage.getItem("divonia-theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}var r=document.documentElement;r.dataset.theme=t;r.style.colorScheme=t}catch(e){}})();`;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: dict.meta.title,
      template: `%s · ${dict.meta.siteName}`,
    },
    description: dict.meta.description,
    icons: {
      icon: "/brand/favicon.png",
      apple: "/brand/apple-touch-icon.png",
    },
    alternates: {
      canonical: `/${locale}/`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/`])),
    },
    openGraph: {
      type: "website",
      siteName: dict.meta.siteName,
      title: dict.meta.title,
      description: dict.meta.description,
      locale: locale === "tr" ? "tr_TR" : "en_US",
      url: `/${locale}/`,
      images: [{ url: "/brand/og.jpg", width: 1200, height: 630, alt: dict.meta.siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: ["/brand/og.jpg"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale as Locale);

  return (
    <html
      lang={locale}
      className={`${bricolage.variable} ${geist.variable} ${pixelify.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="bg-accent-fill sr-only px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[80]"
        >
          {dict.common.skipToContent}
        </a>
        <SmoothScroll />
        <Motion />
        <Header locale={locale as Locale} nav={dict.nav} cta={dict.common.startProject} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer locale={locale as Locale} dict={dict} />
      </body>
    </html>
  );
}
