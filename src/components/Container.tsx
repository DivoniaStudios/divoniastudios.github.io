export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Bölüm başlığı: başlık, altında piksel çizgi, altında açıklama.
 * Etiket (eyebrow) yok; başlık tek başına yetiyor.
 */
export function SectionHeading({
  title,
  intro,
  className = "",
}: {
  title: string;
  intro?: string;
  className?: string;
}) {
  return (
    <div className={`max-w-2xl ${className}`} data-reveal>
      <h2 className="text-4xl font-bold leading-[1.02] sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      <span className="px-rule mt-6" aria-hidden="true" />
      {intro && (
        <p className="text-muted mt-5 max-w-[60ch] text-base leading-relaxed sm:text-lg">
          {intro}
        </p>
      )}
    </div>
  );
}
