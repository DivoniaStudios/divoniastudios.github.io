import { Container } from "../Container";
import { Countdown } from "../Countdown";
import { PixelButton } from "../PixelButton";
import type { Locale } from "@/i18n/config";
import { pathFor } from "@/i18n/routes";
import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Sayfanın son çağrısı, atari oyunlarındaki "DEVAM?" ekranı gibi: büyük
 * başlık ve geri sayan bir rakam. Sayaç yalnızca bölüm görünürken işliyor.
 */
export function ContinueScreen({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.continueScreen;
  return (
    <section className="border-line relative overflow-hidden border-t py-28 sm:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_55%_at_50%_60%,var(--accent-glow),transparent_70%)]"
      />
      <Container className="relative flex flex-col items-center text-center">
        <div data-reveal className="flex items-center gap-6 sm:gap-10">
          <h2 className="font-pixel text-6xl font-semibold tracking-wide sm:text-8xl lg:text-9xl">
            {t.title}
          </h2>
          <Countdown />
        </div>
        <p data-reveal data-reveal-delay="120" className="text-muted mt-8 max-w-lg text-lg leading-relaxed">
          {t.text}
        </p>
        <div data-reveal data-reveal-delay="220" className="mt-10 flex flex-col items-center gap-5">
          <PixelButton href={pathFor(locale, "contact")}>{dict.common.startProject}</PixelButton>
          <p className="text-faint text-sm">
            {t.or}{" "}
            <a href={`mailto:${dict.footer.email}`} className="link-px inline-block py-3">
              {dict.footer.email}
            </a>
          </p>
        </div>
      </Container>
    </section>
  );
}
