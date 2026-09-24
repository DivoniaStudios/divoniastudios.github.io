import Link from "next/link";

type Variant = "primary" | "ghost";

/**
 * Piksel buton: dışta sert gölgeli kabuk, içte çentikli yüz.
 * İç bağlantılar için next/link, dış bağlantılar için <a> kullanılır.
 */
export function PixelButton({
  href,
  children,
  variant = "primary",
  size = "md",
  external = false,
  newTabLabel,
  className = "",
  prefetch,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: "md" | "sm";
  external?: boolean;
  /** Ekran okuyucu için "yeni sekmede açılır" notu */
  newTabLabel?: string;
  className?: string;
  prefetch?: boolean;
}) {
  const classes = `btn-px btn-${variant} ${size === "sm" ? "btn-sm" : ""} ${className}`;
  const face = (
    <span className="px-notch px-box">
      {children}
      {external && newTabLabel && <span className="sr-only">({newTabLabel})</span>}
    </span>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {face}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} prefetch={prefetch}>
      {face}
    </Link>
  );
}
