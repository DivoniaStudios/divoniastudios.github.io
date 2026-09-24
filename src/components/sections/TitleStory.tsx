"use client";

import { Fragment, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { Container } from "../Container";
import { VoxelHeart, levelFor } from "../VoxelHeart";
import type { Locale } from "@/i18n/config";
import { gamePath, pathFor } from "@/i18n/routes";
import type { Dictionary } from "@/i18n/dictionaries";

type Segment = { text: string; accent: boolean };

/** Başlık parçalarını kelimelere böler; bir kelime birden çok parça olabilir. */
function toWords(segments: readonly Segment[]): Segment[][] {
  const words: Segment[][] = [];
  let current: Segment[] = [];
  for (const segment of segments) {
    for (const piece of segment.text.split(/(\s+)/)) {
      if (!piece) continue;
      if (/^\s+$/.test(piece)) {
        if (current.length) {
          words.push(current);
          current = [];
        }
      } else {
        current.push({ text: piece, accent: segment.accent });
      }
    }
  }
  if (current.length) words.push(current);
  return words;
}

const XP_SEGMENTS = 24;

/**
 * Açılış: arka planda voksel kalp, üzerinde kaydırmayla değişen dört panel.
 * İlk panel karşılama; diğer üçü stüdyonun üç işi (kendi oyunu, markalar,
 * platformlar). Alttaki HUD seviyeyi ve deneyim çubuğunu gösteriyor; kalp
 * sahnesi de aynı seviyeye göre çözünürlük atlıyor.
 *
 * İlk panel sunucu çıktısında zaten görünür gelir; JS çalışmasa da sayfa
 * anlamlı kalır.
 */
export function TitleStory({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const panelsRef = useRef<HTMLDivElement>(null);
  const levelRef = useRef<HTMLSpanElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const { hero } = dict;
  const words = toWords(hero.title);
  const afterTitle = 0.25 + words.length * 0.06;

  const panelLinks: string[] = [
    gamePath(locale, "date-for-dead"),
    pathFor(locale, "services"),
    pathFor(locale, "games"),
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const panels = panelsRef.current;
    if (!section || !panels) return;

    const items = Array.from(panels.querySelectorAll<HTMLElement>("[data-panel]"));
    const segments = Array.from(barRef.current?.children ?? []) as HTMLElement[];
    const total = items.length;
    let frame = 0;
    let lastLevel = -1;
    let lastLit = -1;

    // Telefonda paneller ekranın çoğunu kaplıyor; iki panel aynı anda
    // okunmasın diye durma payı büyük, geçiş kısa.
    const narrow = window.matchMedia("(max-width: 860px)");
    let hold = 0.22;
    let fade = 0.6;
    const tune = () => {
      hold = narrow.matches ? 0.34 : 0.22;
      fade = narrow.matches ? 0.3 : 0.6;
    };
    tune();

    const apply = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      if (span <= 0) return;

      const progress = Math.min(1, Math.max(0, -rect.top / span));
      progressRef.current = progress;

      const spread = total - 1;
      items.forEach((item, index) => {
        const distance = progress * spread - index;
        const away = Math.min(1, Math.max(0, (Math.abs(distance) - hold) / fade));
        item.style.opacity = (1 - away).toFixed(3);
        item.style.transform = `translate3d(0, ${(-distance * 60).toFixed(1)}px, 0)`;
        item.style.pointerEvents = Math.abs(distance) < 0.4 ? "auto" : "none";
        item.toggleAttribute("inert", Math.abs(distance) >= 0.4);
      });

      const level = levelFor(progress);
      if (level !== lastLevel && levelRef.current) {
        levelRef.current.textContent = `${level + 1}/${total}`;
        lastLevel = level;
      }
      if (percentRef.current) {
        percentRef.current.textContent = `${String(Math.round(progress * 100)).padStart(3, "0")}%`;
      }
      const lit = Math.round(progress * XP_SEGMENTS);
      if (lit !== lastLit) {
        segments.forEach((segment, index) => segment.classList.toggle("on", index < lit));
        lastLit = lit;
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onNarrow = () => {
      tune();
      apply();
    };

    apply();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    narrow.addEventListener("change", onNarrow);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      narrow.removeEventListener("change", onNarrow);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={sectionRef} className="story relative" aria-label={dict.meta.siteName}>
      <div className="sticky top-0 h-dvh overflow-hidden">
        <VoxelHeart progressRef={progressRef} />
        <div className="story-veil" aria-hidden="true" />

        <Container className="relative z-10 flex h-full items-end pb-28 md:items-center md:pb-0">
          <div ref={panelsRef} className="story-panels grid w-full">
            {/* Panel 0: karşılama */}
            <div data-panel className="story-panel max-w-3xl">
              <h1 className="text-[2.6rem] leading-[1.02] font-extrabold sm:text-6xl lg:text-7xl">
                {words.map((word, index) => (
                  <Fragment key={index}>
                    {index > 0 && " "}
                    <span className="word-mask">
                      <span
                        className="word-rise"
                        style={{ animationDelay: `${0.2 + index * 0.06}s` }}
                      >
                        {word.map((part, partIndex) => (
                          <span
                            key={partIndex}
                            className={part.accent ? "text-accent-text" : undefined}
                          >
                            {part.text}
                          </span>
                        ))}
                      </span>
                    </span>
                  </Fragment>
                ))}
              </h1>

              <p
                className="text-muted fade-up mt-6 max-w-xl text-base leading-relaxed sm:text-lg"
                style={{ animationDelay: `${afterTitle}s` }}
              >
                {hero.subtitle}
              </p>

              <div
                className="fade-up mt-9 flex flex-wrap items-center gap-4"
                style={{ animationDelay: `${afterTitle + 0.12}s` }}
              >
                <Link
                  href={gamePath(locale, "date-for-dead")}
                  className="btn-px btn-primary"
                >
                  <span className="px-notch px-box">{hero.ctaPrimary}</span>
                </Link>
                <Link href={pathFor(locale, "contact")} className="btn-px btn-ghost">
                  <span className="px-notch px-box">{dict.common.startProject}</span>
                </Link>
              </div>
            </div>

            {/* Panel 1-3: stüdyonun üç işi */}
            {hero.panels.map((panel, index) => (
              <div key={panel.title} data-panel className="story-panel max-w-xl">
                <p className="hud text-accent-text">
                  {dict.hud.level} {index + 2}
                </p>
                <h2 className="mt-4 text-4xl leading-[1.04] font-bold sm:text-5xl lg:text-6xl">
                  {panel.title}
                </h2>
                <p className="text-muted mt-5 text-base leading-relaxed sm:text-lg">
                  {panel.text}
                </p>
                <Link
                  href={panelLinks[index]}
                  className="group hud text-ink mt-8 inline-flex items-center gap-2 !text-sm"
                >
                  <span className="border-accent border-b-2 pb-1">{panel.link}</span>
                  <ArrowRight
                    size={16}
                    weight="bold"
                    aria-hidden
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>
            ))}
          </div>
        </Container>

        <div className="story-hud" aria-hidden="true">
          <Container className="flex items-end gap-5">
            <div className="shrink-0">
              <p className="hud text-faint">{dict.hud.level}</p>
              <p className="hud text-ink mt-1.5 !text-lg">
                <span ref={levelRef}>1/4</span>
              </p>
            </div>
            <div ref={barRef} className="xp-bar mb-1.5 flex-1">
              {Array.from({ length: XP_SEGMENTS }, (_, index) => (
                <span key={index} />
              ))}
            </div>
            <div className="shrink-0 text-right">
              <p className="hud text-faint">{dict.hud.progress}</p>
              <p className="hud text-ink mt-1.5 !text-lg">
                <span ref={percentRef}>000%</span>
              </p>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
