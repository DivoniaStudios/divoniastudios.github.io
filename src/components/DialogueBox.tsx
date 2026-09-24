"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CaretDown, ArrowCounterClockwise } from "@phosphor-icons/react";

/**
 * Görsel roman diyalog kutusu; Date For Dead'in kendi arayüzünden
 * (açık zeminli kutu, koyu isim sekmesi). Satırlar harf harf yazılıyor,
 * tıklayınca ya da Enter/Boşluk'a basınca satır tamamlanıyor, tekrar
 * basınca sonraki satıra geçiliyor.
 *
 * Yazım yalnızca kutu ekrana girince başlıyor. Hareket azaltmada satırlar
 * doğrudan tam görünüyor. Ekran okuyucular için metnin tamamı ayrıca
 * görünmez bir paragrafta duruyor; yazılan metin onlardan gizli.
 */
export function DialogueBox({
  speaker,
  lines,
  hint,
  replayLabel,
}: {
  speaker: string;
  lines: string[];
  hint: string;
  replayLabel: string;
}) {
  const [line, setLine] = useState(0);
  const [shown, setShown] = useState(0);
  const [started, setStarted] = useState(false);
  const [instant, setInstant] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const text = lines[line] ?? "";
  const typing = shown < text.length;
  const finished = line === lines.length - 1 && !typing;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInstant(true);
      setStarted(true);
      return;
    }
    const el = boxRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    if (instant) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShown(text.length);
      return;
    }
    if (shown >= text.length) return;
    const timer = window.setTimeout(() => setShown((value) => value + 1), 24);
    return () => window.clearTimeout(timer);
  }, [started, instant, shown, text.length]);

  const advance = useCallback(() => {
    if (!started) {
      setStarted(true);
      return;
    }
    if (typing) {
      setShown(text.length);
    } else if (line < lines.length - 1) {
      setLine((value) => value + 1);
      setShown(0);
    }
  }, [started, typing, text.length, line, lines.length]);

  const replay = () => {
    setLine(0);
    setShown(0);
  };

  return (
    <div ref={boxRef} className="relative">
      <p className="sr-only">{lines.join(" ")}</p>

      <div className="vn-tab px-notch px-box inline-block px-5 py-2" aria-hidden>
        <span className="font-pixel text-lg font-semibold">{speaker}</span>
      </div>

      <button
        type="button"
        onClick={advance}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            advance();
          }
        }}
        aria-label={hint}
        className="vn-box px-notch px-box -mt-px block min-h-[9.5rem] w-full cursor-pointer px-6 py-5 text-left sm:min-h-[8.5rem] sm:px-8 sm:py-6"
      >
        <span
          aria-hidden
          className={`block max-w-[62ch] text-lg leading-relaxed sm:text-xl ${
            typing && started ? "caret" : ""
          }`}
        >
          {started ? text.slice(0, shown) : ""}
        </span>

        {!typing && started && !finished && (
          <CaretDown
            size={20}
            weight="fill"
            aria-hidden
            className="nudge absolute right-6 bottom-4 text-[var(--paper-muted)]"
          />
        )}
      </button>

      <div className="mt-3 flex items-center justify-between gap-4">
        <p className="hud text-faint" aria-hidden>
          {line + 1}/{lines.length} · {hint}
        </p>
        {finished && (
          <button
            type="button"
            onClick={replay}
            className="hud text-muted hover:text-ink inline-flex items-center gap-1.5 py-2 !text-xs"
          >
            <ArrowCounterClockwise size={13} weight="bold" aria-hidden />
            {replayLabel}
          </button>
        )}
      </div>
    </div>
  );
}
