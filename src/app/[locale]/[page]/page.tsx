import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import {
  pageKeys,
  pageSegment,
  pageKeyFromSegment,
  type PageKey,
} from "@/i18n/routes";
import { GamesContent } from "@/components/pages/GamesContent";
import { ServicesContent } from "@/components/pages/ServicesContent";
import { ContactContent } from "@/components/pages/ContactContent";

type Params = { params: Promise<{ locale: string; page: string }> };

/**
 * Oyunlar / Hizmetler / İletişim buradan üretilir. URL parçası dile göre
 * değiştiği için (/tr/oyunlar, /en/games) tek dinamik segment yetiyor.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    pageKeys.map((key) => ({ locale, page: pageSegment(locale, key) })),
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, page } = await params;
  if (!isLocale(locale)) return {};
  const key = pageKeyFromSegment(locale, page);
  if (!key) return {};
  const dict = getDictionary(locale);
  const meta: Record<PageKey, Metadata> = {
    games: { title: dict.gamesPage.title, description: dict.gamesPage.subtitle },
    services: { title: dict.servicesPage.title, description: dict.servicesPage.subtitle },
    contact: { title: dict.contactPage.title, description: dict.contactPage.subtitle },
  };
  return {
    ...meta[key],
    alternates: {
      canonical: `/${locale}/${page}/`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/${pageSegment(l, key)}/`])),
    },
  };
}

export default async function LocalizedPage({ params }: Params) {
  const { locale, page } = await params;
  if (!isLocale(locale)) notFound();
  const key = pageKeyFromSegment(locale, page);
  if (!key) notFound();
  const dict = getDictionary(locale);

  switch (key) {
    case "games":
      return <GamesContent locale={locale} dict={dict} />;
    case "services":
      return <ServicesContent locale={locale} dict={dict} />;
    case "contact":
      return <ContactContent dict={dict} />;
  }
}
