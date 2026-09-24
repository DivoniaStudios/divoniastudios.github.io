import { Container } from "./Container";

/** İç sayfaların başlığı. Üst menü sabit olduğu için üstte pay var. */
export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pt-32 pb-14 sm:pt-40 sm:pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] h-[36rem] w-[36rem] bg-[radial-gradient(circle,var(--accent-glow),transparent_65%)]"
      />
      <Container className="relative">
        <h1 className="text-5xl leading-[0.98] font-extrabold sm:text-7xl lg:text-8xl">
          <span className="word-mask">
            <span className="word-rise">{title}</span>
          </span>
        </h1>
        <span className="px-rule fade-up mt-8" style={{ animationDelay: "0.3s" }} aria-hidden />
        {subtitle && (
          <p
            className="text-muted fade-up mt-6 max-w-2xl text-lg leading-relaxed sm:text-xl"
            style={{ animationDelay: "0.4s" }}
          >
            {subtitle}
          </p>
        )}
        {children}
      </Container>
    </section>
  );
}
