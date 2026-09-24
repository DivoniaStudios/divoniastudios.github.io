import path from "node:path";
import type { NextConfig } from "next";

/**
 * Site tamamen statik HTML olarak üretilir (`out/` klasörü) ve GitHub Pages'te
 * yayınlanır. Bu yüzden sunucu tarafı özellik (middleware, redirects, rewrites,
 * görsel optimizasyonu) kullanılmaz; görseller public/ altında önceden
 * WebP'ye çevrilmiş olarak durur.
 *
 * Dile göre değişen URL'ler gerçek klasör olarak üretilir; bunu sağlayan tablo
 * src/i18n/routes.ts içinde. Kök adres (/) için yönlendirme public/index.html'de.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },

  // Üst klasörlerdeki alakasız bir package-lock.json'ın kök seçilmesini engeller.
  turbopack: { root: path.resolve(__dirname) },
};

export default nextConfig;
