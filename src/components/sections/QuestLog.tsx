import { Check } from "@phosphor-icons/react/dist/ssr";
import { Container, SectionHeading } from "../Container";
import { StoreIcon } from "../StoreIcon";
import { PhoneFan } from "../PhoneFan";
import type { Locale } from "@/i18n/config";
import { games, type Game } from "@/data/games";
import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Müşteri işleri, oyunlardaki görev kaydı gibi. Asimetrik iki sütun:
 * KidZania geniş fotoğrafla, PhotoSensia Kids telefon ekranlarıyla.
 * Her kaydın durumu "TAMAMLANDI"; bu gerçek bir durum, iki oyun da yayında.
 */
export function QuestLog({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const client = games.filter((game) => game.kind === "client");
  const kidzania = client.find((game) => game.slug === "kidzania");
  const photosensia = client.find((game) => game.slug === "photosensia-kids");

  return (
    <section className="bg-deep border-line border-y py-24 sm:py-32">
      <Container>
        <SectionHeading title={dict.quests.title} intro={dict.quests.intro} />

        <div className="mt-16 grid gap-6 lg:grid-cols-12">
          {kidzania && (
            <article
              data-reveal
              className="px-notch px-box spotlight flex flex-col lg:col-span-7"
              data-spotlight
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={kidzania.coverSmall ?? kidzania.cover}
                  srcSet={`${kidzania.coverSmall} 900w, ${kidzania.cover} 1800w`}
                  sizes="(min-width: 1024px) 700px, 100vw"
                  alt={kidzania.coverAlt[locale]}
                  width={1800}
                  height={1202}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
              <QuestBody game={kidzania} locale={locale} dict={dict} />
            </article>
          )}

          {photosensia && (
            <article
              data-reveal
              data-reveal-delay="120"
              className="px-notch px-box spotlight flex flex-col lg:col-span-5"
              data-spotlight
            >
              <PhoneFan className="aspect-[16/10] lg:aspect-auto lg:min-h-[22rem] lg:flex-1" />
              <QuestBody game={photosensia} locale={locale} dict={dict} />
            </article>
          )}
        </div>
      </Container>
    </section>
  );
}

function QuestBody({ game, locale, dict }: { game: Game; locale: Locale; dict: Dictionary }) {
  const t = dict.quests;
  return (
    <div className="relative z-[3] flex flex-1 flex-col p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-2xl font-bold sm:text-3xl">{game.title}</h3>
        <span className="hud text-accent-text flex shrink-0 items-center gap-1.5 pt-2">
          <Check size={14} weight="bold" aria-hidden />
          {t.done}
        </span>
      </div>

      <p className="text-muted mt-4 max-w-[60ch] text-[0.95rem] leading-relaxed">
        {game.summary[locale]}
      </p>

      <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
        {game.client && (
          <div>
            <dt className="hud text-faint">{t.client}</dt>
            <dd className="mt-1.5 text-sm">{game.client}</dd>
          </div>
        )}
        <div>
          <dt className="hud text-faint">{t.platform}</dt>
          <dd className="mt-1.5 text-sm">
            {game.platforms.map((platform) => dict.platforms[platform]).join(", ")}
          </dd>
        </div>
        {game.year && (
          <div>
            <dt className="hud text-faint">{t.year}</dt>
            <dd className="mt-1.5 text-sm">{game.year}</dd>
          </div>
        )}
      </dl>

      <div className="mt-auto flex flex-wrap gap-3 pt-7">
        {game.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-px btn-ghost btn-sm"
          >
            <span className="px-notch px-box">
              <StoreIcon kind={link.kind} />
              {dict.stores[link.kind]}
              <span className="sr-only">({dict.common.opensNewTab})</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
