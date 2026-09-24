import { SteamLogo, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Container, SectionHeading } from "../Container";
import { DialogueBox } from "../DialogueBox";
import type { Locale } from "@/i18n/config";
import { characters, screenshots, STEAM_URL, type Game } from "@/data/games";
import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Date For Dead sayfası. Metinlerin tamamı Steam sayfasının resmi
 * metninden; sayfa bir şey vaat etmiyor, oyunun kendisini gösteriyor.
 *
 * Bölümler: tam ekran sahne → diyalog kutusu (oyunun arayüzü) →
 * özellikler → karakter seçimi → ekran görüntüleri → künye ve çağrı.
 */
export function GameDetailContent({
  locale,
  dict,
  game,
}: {
  locale: Locale;
  dict: Dictionary;
  game: Game;
}) {
  const t = dict.gamePage;

  const wishlist = (
    <a href={STEAM_URL} target="_blank" rel="noopener noreferrer" className="btn-px btn-primary">
      <span className="px-notch px-box">
        <SteamLogo size={20} weight="fill" aria-hidden />
        {dict.common.wishlistLong}
        <span className="sr-only">({dict.common.opensNewTab})</span>
      </span>
    </a>
  );

  return (
    <>
      {/* Sahne: Valerie'nin barı, tam ekran */}
      <section className="relative flex min-h-[92dvh] items-end overflow-hidden">
        {/* Ekran görüntüsünün alt kısmı (oyunun diyalog kutusu) kırpılmış
            sürüm; kutu başlığın arkasında okunup karışıklık yaratıyordu. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/games/date-for-dead/hero.webp"
          alt={game.coverAlt[locale]}
          width={1920}
          height={790}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-[70%_20%]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--void)_94%,transparent)_0%,color-mix(in_srgb,var(--void)_72%,transparent)_42%,color-mix(in_srgb,var(--void)_10%,transparent)_75%),linear-gradient(0deg,var(--void)_0%,transparent_45%)]"
        />
        <Container className="relative pt-32 pb-16 sm:pb-24">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/games/date-for-dead/capsule.webp"
            alt=""
            width={460}
            height={215}
            className="fade-up w-60 sm:w-72"
            style={{ animationDelay: "0.1s" }}
          />
          <h1 className="mt-8 max-w-2xl text-4xl leading-[1.03] font-extrabold sm:text-6xl">
            <span className="sr-only">{game.title}: </span>
            {dict.deck.title.split(" ").map((word, index) => (
              <span key={index}>
                {index > 0 && " "}
                <span className="word-mask">
                  <span className="word-rise" style={{ animationDelay: `${0.2 + index * 0.05}s` }}>
                    {word}
                  </span>
                </span>
              </span>
            ))}
          </h1>
          <p
            className="text-muted fade-up mt-6 max-w-xl text-lg leading-relaxed"
            style={{ animationDelay: "0.7s" }}
          >
            {dict.deck.text}
          </p>
          <div className="fade-up mt-9 flex flex-wrap items-center gap-5" style={{ animationDelay: "0.85s" }}>
            {wishlist}
            <p className="hud text-faint">{game.status[locale]}</p>
          </div>
        </Container>
      </section>

      {/* Oyun hakkında: oyunun kendi diyalog kutusuyla */}
      <section className="py-24 sm:py-32">
        <Container>
          <SectionHeading title={t.about} />
          <div data-reveal className="relative mt-12 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/games/date-for-dead/ss-5.webp"
              alt=""
              width={1920}
              height={1080}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover opacity-45"
            />
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(0deg,color-mix(in_srgb,var(--void)_85%,transparent),color-mix(in_srgb,var(--void)_20%,transparent)_70%)]" />
            <div className="relative px-4 pt-40 pb-6 sm:px-10 sm:pt-64 sm:pb-10">
              <DialogueBox
                speaker={t.speaker}
                lines={t.lines}
                hint={t.dialogueHint}
                replayLabel={t.replay}
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Özellikler: solda sabit başlık, sağda liste */}
      <section className="bg-deep/75 border-line border-y py-24 sm:py-32">
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading title={t.featuresTitle} />
          </div>
          <ul className="divide-line divide-y">
            {t.features.map((feature, index) => (
              <li
                key={feature.title}
                data-reveal
                data-reveal-delay={String(index * 90)}
                className="grid gap-4 py-8 first:pt-0 sm:grid-cols-[1.25rem_1fr]"
              >
                <span className="bg-accent mt-3 hidden h-2.5 w-2.5 sm:block" aria-hidden />
                <div>
                  <h3 className="text-2xl font-bold">{feature.title}</h3>
                  <p className="text-muted mt-3 max-w-[58ch] leading-relaxed">{feature.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Karakter seçimi */}
      <section className="py-24 sm:py-32">
        <Container>
          <SectionHeading title={t.castTitle} />
          <ul className="mt-14 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {characters.map((character, index) => (
              <li key={character.id} data-reveal data-reveal-delay={String(index * 90)}>
                <figure className="tilt px-notch px-box relative flex h-full flex-col hover:[--px-border:var(--accent)]">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={character.image}
                      alt={`${character.name}: ${character.role[locale]}`}
                      width={600}
                      height={800}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                  <figcaption className="relative z-[3] p-4 sm:p-5">
                    <p className="font-display text-xl font-bold sm:text-2xl">
                      {character.name}
                      {character.age && (
                        <span className="text-muted font-sans text-base font-normal">, {character.age}</span>
                      )}
                    </p>
                    <p className="text-muted mt-1.5 text-sm leading-snug">{character.role[locale]}</p>
                  </figcaption>
                </figure>
              </li>
            ))}
            <li data-reveal data-reveal-delay="270">
              <figure className="px-notch px-box flex h-full flex-col">
                <div className="relative flex aspect-[3/4] items-center justify-center bg-[radial-gradient(ellipse_at_50%_35%,#2c2638,#15121c_70%)]">
                  <span className="font-pixel text-8xl text-white/15" aria-hidden>
                    ?
                  </span>
                </div>
                <figcaption className="p-4 sm:p-5">
                  <p className="font-display text-xl font-bold sm:text-2xl">{dict.deck.mysteryName}</p>
                  <p className="text-muted mt-1.5 text-sm leading-snug">{dict.deck.mysteryRole}</p>
                </figcaption>
              </figure>
            </li>
          </ul>
        </Container>
      </section>

      {/* Ekran görüntüleri: yatay şerit */}
      <section className="pb-24 sm:pb-32" aria-labelledby="gallery-title">
        <Container>
          <h2 id="gallery-title" className="text-3xl font-bold sm:text-4xl" data-reveal>
            {t.galleryTitle}
          </h2>
        </Container>
        <ul
          className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:gap-6 sm:px-6 lg:px-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]"
          tabIndex={0}
          aria-label={t.galleryTitle}
        >
          {screenshots.map((shot, index) => (
            <li key={shot.full} className="w-[85vw] shrink-0 snap-start sm:w-[34rem] lg:w-[42rem]">
              <a
                href={shot.full}
                target="_blank"
                rel="noopener noreferrer"
                className="group px-notch relative block overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={shot.small}
                  alt={`${t.galleryLabel} ${index + 1}`}
                  width={960}
                  height={540}
                  loading="lazy"
                  decoding="async"
                  className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span className="bg-void/80 absolute right-3 bottom-3 p-2 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  <ArrowUpRight size={16} weight="bold" aria-hidden />
                  <span className="sr-only">({dict.common.opensNewTab})</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Künye ve çağrı */}
      <section className="bg-deep/75 border-line border-t py-24 sm:py-32">
        <Container className="grid gap-14 lg:grid-cols-2">
          <div data-reveal>
            <h2 className="text-4xl leading-[1.04] font-bold sm:text-5xl">{t.ctaTitle}</h2>
            <p className="text-muted mt-5 max-w-md text-lg leading-relaxed">{t.ctaText}</p>
            <div className="mt-9">{wishlist}</div>
          </div>
          <div data-reveal data-reveal-delay="120">
            <h3 className="hud text-faint">{t.factsTitle}</h3>
            <dl className="mt-5 grid grid-cols-1 gap-x-10 sm:grid-cols-2">
              {t.facts.map((fact) => (
                <div key={fact.k} className="border-line border-t py-4">
                  <dt className="text-faint text-sm">{fact.k}</dt>
                  <dd className="mt-1 font-medium">{fact.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>
    </>
  );
}
