/**
 * Stüdyo logosu. Orijinal logo siyah çizgili; koyu zeminde görünsün diye
 * çizgileri açık renge çevrilmiş sürümü kullanılıyor
 * (public/brand/logo-on-dark.png, logo.png'den üretildi).
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
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/logo-on-dark.png"
      alt="Divonia Studios"
      width={width}
      height={height}
      decoding="async"
      className={`block ${className}`}
      style={{ height, width: "auto" }}
    />
  );
}
