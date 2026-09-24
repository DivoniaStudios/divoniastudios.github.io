"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Heart, X, ArrowCounterClockwise, SteamLogo } from "@phosphor-icons/react";
import type { Character } from "@/data/games";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

type Card =
  | { kind: "character"; character: Character }
  | { kind: "mystery" };

type Choice = "like" | "pass";

/** Kartın atılması için gereken yatay sürükleme (px) */
const THRESHOLD = 90;

/**
 * Date For Dead'in kendi mekaniği: oyundaki "monsterCELL" uygulaması gibi
 * karakter profilleri sağa (beğen) ya da sola (geç) kaydırılıyor. Deste
 * bitince istek listesi çağrısı çıkıyor.
 *
 * Sürükleme sırasında konum React state'ine yazılmıyor; her pointermove'da
 * yeniden render olmasın diye kartın stili doğrudan güncelleniyor.
 *
 * Klavye: deste odaktayken ← geç, → beğen. Butonlar her zaman çalışır.
 */
export function MatchDeck({
  locale,
  dict,
  characters,
  steamUrl,
}: {
  locale: Locale;
  dict: Dictionary;
  characters: Character[];
  steamUrl: string;
}) {
  const t = dict.deck;
  const cards: Card[] = [
    ...characters.map((character) => ({ kind: "character" as const, character })),
    { kind: "mystery" as const },
  ];

  const [index, setIndex] = useState(0);
  const [matches, setMatches] = useState(0);
  const [popKey, setPopKey] = useState(0);
  const [announce, setAnnounce] = useState("");
  const topRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const drag = useRef<{ x: number; y: number; id: number } | null>(null);

  const done = index >= cards.length;

  const nameOf = (card: Card) =>
    card.kind === "character" ? card.character.name : t.mysteryName;

  const setStamps = (el: HTMLElement, dx: number) => {
    const like = el.querySelector<HTMLElement>("[data-stamp='like']");
    const pass = el.querySelector<HTMLElement>("[data-stamp='pass']");
    if (like) like.style.opacity = String(Math.min(1, Math.max(0, dx / THRESHOLD)));
    if (pass) pass.style.opacity = String(Math.min(1, Math.max(0, -dx / THRESHOLD)));
  };

  const decide = useCallback(
    (choice: Choice) => {
      if (busy.current || index >= cards.length) return;
      busy.current = true;
      const el = topRef.current;
      const dir = choice === "like" ? 1 : -1;
      if (el) {
        el.classList.remove("is-dragging");
        el.style.transform = `translate3d(${dir * 130}%, -4%, 0) rotate(${dir * 16}deg)`;
        el.style.opacity = "0";
        setStamps(el, dir * THRESHOLD);
      }
      const card = cards[index];
      if (choice === "like") {
        setMatches((value) => value + 1);
        setPopKey((value) => value + 1);
        setAnnounce(`${nameOf(card)}: ${t.matched}`);
      } else {
        setAnnounce(`${nameOf(card)}: ${t.pass}`);
      }
      window.setTimeout(() => {
        setIndex((value) => value + 1);
        busy.current = false;
      }, 300);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [index, cards.length],
  );

  // Yeni üst kart geldiğinde kalıntı stilleri temizle
  useEffect(() => {
    const el = topRef.current;
    if (!el) return;
    el.style.transform = "";
    el.style.opacity = "";
    setStamps(el, 0);
  }, [index]);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (busy.current) return;
    drag.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.classList.add("is-dragging");
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = drag.current;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = (event.clientY - start.y) * 0.25;
    const el = event.currentTarget;
    el.style.transform = `translate3d(${dx}px, ${dy}px, 0) rotate(${dx * 0.06}deg)`;
    setStamps(el, dx);
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = drag.current;
    if (!start || start.id !== event.pointerId) return;
    drag.current = null;
    const dx = event.clientX - start.x;
    const el = event.currentTarget;
    el.classList.remove("is-dragging");
    if (Math.abs(dx) > THRESHOLD) {
      decide(dx > 0 ? "like" : "pass");
    } else {
      el.style.transform = "";
      setStamps(el, 0);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      decide("like");
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      decide("pass");
    }
  };

  const restart = () => {
    setIndex(0);
    setMatches(0);
    setAnnounce("");
  };

  return (
    <div className="phone mx-auto">
      <div
        className="phone-screen flex flex-col"
        role="group"
        aria-label={t.deckLabel}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {/* Uygulama çubuğu: oyundaki monsterCELL arayüzü */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <span className="font-pixel text-paper-ink text-sm font-semibold">monsterCELL</span>
          <span className="font-pixel text-paper-ink/80 flex items-center gap-1 text-sm" aria-hidden>
            <Heart size={14} weight="fill" className="text-accent" />
            {matches}
          </span>
        </div>

        <div className="relative mx-3 mb-7 flex-1">
          {done ? (
            <div className="flex h-full flex-col items-center justify-center px-4 text-center">
              <Heart size={44} weight="fill" className="text-accent" aria-hidden />
              <p className="font-display mt-4 text-2xl leading-tight font-bold">{t.endTitle}</p>
              <p className="text-paper-muted mt-3 text-sm leading-relaxed" style={{ color: "var(--paper-muted)" }}>
                {t.endText}
              </p>
              <a
                href={steamUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-px btn-primary btn-sm mt-6"
              >
                <span className="px-notch px-box">
                  <SteamLogo size={18} weight="fill" aria-hidden />
                  {dict.common.wishlist}
                  <span className="sr-only">({dict.common.opensNewTab})</span>
                </span>
              </a>
              <button
                type="button"
                onClick={restart}
                className="font-display mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold underline decoration-2 underline-offset-4"
                style={{ color: "var(--paper-muted)" }}
              >
                <ArrowCounterClockwise size={14} weight="bold" aria-hidden />
                {t.restart}
              </button>
            </div>
          ) : (
            cards.map((card, cardIndex) => {
              if (cardIndex < index || cardIndex > index + 2) return null;
              const depth = cardIndex - index;
              const isTop = depth === 0;
              return (
                <div
                  key={cardIndex}
                  ref={isTop ? topRef : undefined}
                  className="deck-card overflow-hidden rounded-2xl bg-[#2a2530] shadow-[0_10px_30px_-12px_rgb(0_0_0/0.5)]"
                  style={{
                    zIndex: 10 - depth,
                    transform: isTop
                      ? undefined
                      : `translate3d(0, ${depth * 12}px, 0) scale(${1 - depth * 0.05})`,
                    cursor: isTop ? "grab" : undefined,
                  }}
                  aria-hidden={!isTop}
                  onPointerDown={isTop ? onPointerDown : undefined}
                  onPointerMove={isTop ? onPointerMove : undefined}
                  onPointerUp={isTop ? onPointerUp : undefined}
                  onPointerCancel={isTop ? onPointerUp : undefined}
                >
                  <CardFace card={card} t={t} locale={locale} />
                  <span data-stamp="like" aria-hidden className="stamp text-accent left-4 -rotate-12 bg-white">
                    {t.like.toUpperCase()}
                  </span>
                  <span data-stamp="pass" aria-hidden className="stamp right-4 rotate-12 bg-[#2a2530] text-white">
                    {t.pass.toUpperCase()}
                  </span>
                </div>
              );
            })
          )}

          {popKey > 0 && !done && (
            <p
              key={popKey}
              className="match-pop font-display pointer-events-none absolute top-1/3 left-1/2 z-20 flex items-center gap-2 bg-[#2a2530] px-4 py-2 text-base font-semibold whitespace-nowrap text-white"
              aria-hidden
            >
              <Heart size={18} weight="fill" className="text-accent" />
              {t.matched}
            </p>
          )}
        </div>

        {!done && (
          <div className="flex items-center justify-center gap-6 py-5">
            <button
              type="button"
              onClick={() => decide("pass")}
              aria-label={t.pass}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#2a2530] shadow-[0_6px_16px_-6px_rgb(0_0_0/0.45)] transition-transform hover:scale-105 active:scale-95"
            >
              <X size={26} weight="bold" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => decide("like")}
              aria-label={t.like}
              className="bg-accent-fill flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_6px_16px_-6px_rgb(216_20_29/0.7)] transition-transform hover:scale-105 active:scale-95"
            >
              <Heart size={26} weight="fill" aria-hidden />
            </button>
          </div>
        )}

        <p className="sr-only" aria-live="polite">
          {announce}
        </p>
      </div>
    </div>
  );
}

function CardFace({
  card,
  t,
  locale,
}: {
  card: Card;
  t: Dictionary["deck"];
  locale: Locale;
}) {
  if (card.kind === "mystery") {
    return (
      <div className="flex h-full flex-col justify-end bg-[radial-gradient(ellipse_at_50%_30%,#3b3446,#1b1822_70%)] p-5 text-white">
        <span
          className="font-pixel absolute top-[22%] left-1/2 -translate-x-1/2 text-8xl text-white/15 select-none"
          aria-hidden
        >
          ?
        </span>
        <p className="font-display text-2xl font-bold">{t.mysteryName}</p>
        <p className="mt-1 text-sm text-white/75">{t.mysteryRole}</p>
      </div>
    );
  }

  const { character } = card;
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={character.image}
        alt=""
        width={600}
        height={800}
        draggable={false}
        decoding="async"
        loading="lazy"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top select-none"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1b1822] via-[#1b1822]/85 to-transparent p-5 pt-16 text-white">
        <p className="font-display text-2xl font-bold">
          {character.name}
          {character.age && (
            <span className="font-sans text-lg font-normal text-white/80">
              , {character.age}
              <span className="sr-only"> {t.ageLabel}</span>
            </span>
          )}
        </p>
        <p className="mt-1 text-sm text-white/80">{character.role[locale]}</p>
      </div>
    </>
  );
}
