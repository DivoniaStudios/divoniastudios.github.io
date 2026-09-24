import Link from "next/link";
import { ArrowRight, SteamLogo } from "@phosphor-icons/react/dist/ssr";
import { Container } from "../Container";
import { MatchDeck } from "../MatchDeck";
import type { Locale } from "@/i18n/config";
import { gamePath } from "@/i18n/routes";
import { characters, STEAM_URL } from "@/data/games";
import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Ana sayfadaki Date For Dead bölümü: solda oyunun vaadi ve künyesi,
 * sağda oynanabilir karakter destesi. Başlık oyunun kendi sloganı.
 */
export function DateForDead({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.deck;
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Oyunun gece sahnesinden gelen soğuk ışık; yalnızca bu bölümde */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_78%_50%,rgb(88_72_150/0.22),transparent_70%)]"
      />
      <Container className="relative grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div data-reveal>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/games/date-for-dead/capsule.webp"
            alt="Date For Dead"
            width={460}
            height={215}
            loading="lazy"
            decoding="async"
            className="w-56 sm:w-64"
          />
          <h2 className="mt-10 text-4xl leading-[1.04] font-bold sm:text-5xl lg:text-6xl">
            {t.title}
          </h2>
          <p className="text-muted mt-6 max-w-[58ch] text-base leading-relaxed sm:text-lg">
            {t.text}
          </p>

          <dl className="border-line mt-10 grid max-w-lg grid-cols-3 gap-4 border-t pt-6">
            {t.facts.map((fact) => (
              <div key={fact.k}>
                <dt className="hud text-faint">{fact.k}</dt>
                <dd className="text-ink mt-2 text-sm leading-snug">{fact.v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <a
              href={STEAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-px btn-primary"
            >
              <span className="px-notch px-box">
                <SteamLogo size={20} weight="fill" aria-hidden />
                {dict.common.wishlistLong}
                <span className="sr-only">({dict.common.opensNewTab})</span>
              </span>
            </a>
            <Link
              href={gamePath(locale, "date-for-dead")}
              className="group hud text-ink inline-flex min-h-11 items-center gap-2 !text-sm"
            >
              <span className="border-accent border-b-2 pb-1">{t.more}</span>
              <ArrowRight size={16} weight="bold" aria-hidden className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div data-reveal data-reveal-delay="150" className="flex flex-col items-center">
          <MatchDeck locale={locale} dict={dict} characters={characters} steamUrl={STEAM_URL} />
          <p className="text-faint mt-6 text-center text-sm">{t.hint}</p>
        </div>
      </Container>
    </section>
  );
}
