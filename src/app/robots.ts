import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";

// Statik export: dosya derleme sırasında bir kez üretilir.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
