import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { gamePath, pathFor, pageKeys } from "@/i18n/routes";
import { games } from "@/data/games";
import { SITE_URL } from "@/data/site";

// Statik export: dosya derleme sırasında bir kez üretilir.
export const dynamic = "force-static";

/** trailingSlash açık olduğu için adresler sonunda / ile biter. */
const url = (path: string) => `${SITE_URL}${path}/`;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return locales.flatMap((locale) => [
    { url: url(pathFor(locale)), lastModified: now, priority: 1 },
    ...pageKeys.map((key) => ({
      url: url(pathFor(locale, key)),
      lastModified: now,
      priority: key === "games" ? 0.9 : 0.7,
    })),
    ...games
      .filter((game) => game.hasPage)
      .map((game) => ({
        url: url(gamePath(locale, game.slug)),
        lastModified: now,
        priority: 0.9,
      })),
  ]);
}
