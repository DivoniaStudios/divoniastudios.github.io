import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { gamePath, pageSegment, pageKeyFromSegment } from "@/i18n/routes";
import { games, getGame } from "@/data/games";
import { GameDetailContent } from "@/components/pages/GameDetailContent";

type Params = {
  params: Promise<{ locale: string; page: string; slug: string }>;
};

/** Oyun detay sayfaları: /tr/oyunlar/date-for-dead, /en/games/date-for-dead */
export const dynamicParams = false;

const withPage = games.filter((game) => game.hasPage);

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    withPage.map((game) => ({
      locale,
      page: pageSegment(locale, "games"),
      slug: game.slug,
    })),
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const game = getGame(slug);
  if (!game) return {};
  return {
    title: game.title,
    description: game.summary[locale],
    alternates: {
      canonical: `${gamePath(locale, slug)}/`,
      languages: Object.fromEntries(locales.map((l) => [l, `${gamePath(l, slug)}/`])),
    },
    openGraph: {
      title: game.title,
      description: game.summary[locale],
      images: [{ url: game.cover, width: 1920, height: 1080, alt: game.coverAlt[locale] }],
    },
  };
}

export default async function GamePage({ params }: Params) {
  const { locale, page, slug } = await params;
  if (!isLocale(locale)) notFound();
  if (pageKeyFromSegment(locale, page) !== "games") notFound();
  const game = getGame(slug);
  if (!game?.hasPage) notFound();
  return <GameDetailContent locale={locale} dict={getDictionary(locale)} game={game} />;
}
