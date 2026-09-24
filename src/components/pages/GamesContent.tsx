import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Container } from "../Container";
import { PageHeader } from "../PageHeader";
import { StoreIcon } from "../StoreIcon";
import { PhoneFan } from "../PhoneFan";
import { ContinueScreen } from "../sections/ContinueScreen";
import type { Locale } from "@/i18n/config";
import { gamePath } from "@/i18n/routes";
import { games, type Game } from "@/data/games";
import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Oyunlar: kendi oyunumuz büyük kartuş, müşteri işleri yanında daha küçük.
 * Kartuşlar imlece göre eğiliyor (tilt); belirme animasyonu dış sarmalayıcıda,
 * çünkü ikisi aynı öğede olursa transform'lar çakışıyor.
 */
export function GamesContent({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [own, ...clients] = [
    ...games.filter((game) => game.kind === "own"),
    ...games.filter((game) => game.kind === "client"),
  ];

  return (
    <>
      <PageHeader title={dict.gamesPage.title} subtitle={dict.gamesPage.subtitle} />

      <Container className="pb-24 sm:pb-32">
        <div className="grid gap-6 lg:grid-cols-12 lg:grid-rows-2">
          <div data-reveal className="lg:col-span-7 lg:row-span-2">
            <Cartridge game={own} locale={locale} dict={dict} large />
          </div>
          {clients.map((game, index) => (
            <div
              key={game.slug}
              data-reveal
              data-reveal-delay={String(120 + index * 100)}
              className="lg:col-span-5"
            >
              <Cartridge game={game} locale={locale} dict={dict} />
            </div>
          ))}
        </div>
      </Container>

      <ContinueScreen locale={locale} dict={dict} />
    </>
  );
}

function Cartridge({
  game,
  locale,
  dict,
  large = false,
}: {
  game: Game;
  locale: Locale;
  dict: Dictionary;
  large?: boolean;
}) {
  const t = dict.gamesPage;
  return (
    <article
      id={game.slug}
      className="tilt spotlight px-notch px-box flex h-full scroll-mt-28 flex-col"
      data-spotlight
    >
      {game.slug === "photosensia-kids" ? (
        <PhoneFan className="aspect-[16/9]" />
      ) : (
        <div className={`relative overflow-hidden ${large ? "aspect-[16/10] lg:aspect-auto lg:flex-1" : "aspect-[16/9]"}`}>
          {/*
            Büyük kartuş geniş ekranda dik bir alan; 16:9 ekran görüntüsü
            orada oyunun diyalog kutusunu yarıdan kesiyordu. Dik alan için
            kutunun üstünden kırpılmış ayrı bir görsel kullanılıyor.
          */}
          <picture>
            {large && (
              <source media="(min-width: 1024px)" srcSet="/games/date-for-dead/cover-tall.webp" />
            )}
            <img
              src={large ? game.cover : (game.coverSmall ?? game.cover)}
              alt={game.coverAlt[locale]}
              width={1920}
              height={1080}
              loading={large ? "eager" : "lazy"}
              decoding="async"
              className="h-full w-full object-cover object-top"
            />
          </picture>
        </div>
      )}

      <div className="relative z-[3] flex flex-col p-6 sm:p-8">
        <p className="hud text-accent-text">{game.kind === "own" ? t.own : t.client}</p>
        <h2 className={`mt-3 font-bold ${large ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl"}`}>
          {game.title}
        </h2>
        <p className="text-faint hud mt-3 !normal-case !tracking-normal">
          {game.platforms.map((platform) => dict.platforms[platform]).join(" / ")}
          {"  ·  "}
          {game.status[locale]}
        </p>
        <p className="text-muted mt-4 max-w-[58ch] text-[0.95rem] leading-relaxed">
          {game.summary[locale]}
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          {game.hasPage && (
            <Link href={gamePath(locale, game.slug)} className="btn-px btn-primary btn-sm">
              <span className="px-notch px-box">
                {t.view}
                <ArrowRight size={16} weight="bold" aria-hidden />
              </span>
            </Link>
          )}
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
                {link.kind === "steam" ? dict.common.wishlist : dict.stores[link.kind]}
                <span className="sr-only">({dict.common.opensNewTab})</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}
