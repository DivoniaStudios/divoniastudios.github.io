import { type Locale, isLocale } from "./config";

/**
 * URL'lerin tek kaynağı. Klasör adı yerine dile göre değişen URL parçası
 * kullanılıyor (/tr/oyunlar, /en/games); sayfalar [page] dinamik
 * segmentinden üretiliyor.
 *
 * Oyun slug'ları ürün adı olduğu için iki dilde de aynı.
 */
export const pageKeys = ["games", "services", "contact"] as const;

export type PageKey = (typeof pageKeys)[number];

export type RouteKey = "home" | PageKey;

const pageSegments: Record<PageKey, Record<Locale, string>> = {
  games: { tr: "oyunlar", en: "games" },
  services: { tr: "hizmetler", en: "services" },
  contact: { tr: "iletisim", en: "contact" },
};

/** Ziyaretçiye gösterilecek yol: pathFor("tr", "games") → "/tr/oyunlar" */
export function pathFor(locale: Locale, key: RouteKey = "home"): string {
  if (key === "home") return `/${locale}`;
  return `/${locale}/${pageSegments[key][locale]}`;
}

/** Oyun detay yolu: /tr/oyunlar/date-for-dead */
export function gamePath(locale: Locale, slug: string): string {
  return `${pathFor(locale, "games")}/${slug}`;
}

export function pageSegment(locale: Locale, key: PageKey): string {
  return pageSegments[key][locale];
}

export function pageKeyFromSegment(
  locale: Locale,
  segment: string,
): PageKey | null {
  return pageKeys.find((key) => pageSegments[key][locale] === segment) ?? null;
}

/** Tarayıcıdaki yolu çözer; dil değiştirirken aynı sayfada kalmak için. */
export function parsePath(pathname: string): {
  locale: Locale;
  key: RouteKey;
  game?: string;
} | null {
  const [locale, page, sub] = pathname.split("/").filter(Boolean);
  if (!locale || !isLocale(locale)) return null;
  if (!page) return { locale, key: "home" };
  const key = pageKeyFromSegment(locale, page);
  if (!key) return null;
  if (key === "games" && sub) return { locale, key, game: sub };
  return { locale, key };
}
