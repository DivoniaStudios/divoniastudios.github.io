/**
 * Stüdyo logosu, temaya göre iki sürüm: gece için çizgileri açık renge
 * çevrilmiş sürüm (logo-on-dark.png), gündüz için orijinal siyah çizgili
 * logo (logo-on-light.png). Hangisinin görüneceğini CSS tokenları
 * (--show-dark / --show-light) belirliyor; JS gerekmiyor.
 */
export function Logo({
  className = "",
  height = 34,
}: {
  className?: string;
  height?: number;
}) {
  // Kaynak görsel 510×264
  const width = Math.round((height * 510) / 264);
  const common = {
    width,
    height,
    decoding: "async" as const,
    style: { height, width: "auto" },
  };
  return (
    <span className={`inline-flex ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/logo-on-dark.png" alt="Divonia Studios" className="only-dark" {...common} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/logo-on-light.png" alt="Divonia Studios" className="only-light" {...common} />
    </span>
  );
}
