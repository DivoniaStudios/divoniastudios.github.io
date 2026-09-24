"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { List, X, CaretRight } from "@phosphor-icons/react";
import { Logo } from "./Logo";
import { Container } from "./Container";
import { locales, type Locale } from "@/i18n/config";
import { gamePath, pathFor, parsePath, type PageKey } from "@/i18n/routes";
import type { Dictionary } from "@/i18n/dictionaries";

const navKeys: PageKey[] = ["games", "services", "contact"];

export function Header({
  locale,
  nav,
  cta,
}: {
  locale: Locale;
  nav: Dictionary["nav"];
  cta: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Duraklatma menüsü açıkken sayfa kaymasın; Esc ile kapansın
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = parsePath(pathname);
  const isActive = (key: PageKey) => current?.key === key;

  return (
    <header
      /*
       * Menü açıkken backdrop-filter yok: filtre, içindeki sabit konumlu
       * duraklatma menüsü için yeni bir kapsayıcı oluşturuyor ve menü
       * header'ın 64px yüksekliğine sıkışıp görünmez oluyordu.
       */
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        open
          ? "border-line bg-void border-b"
          : scrolled
            ? "border-line bg-void/85 border-b backdrop-blur-md"
            : "border-b border-transparent"
      }`}
    >
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]">
        <Link
          href={pathFor(locale)}
          aria-label={nav.home}
          className="flex min-h-11 items-center transition-opacity hover:opacity-85"
          onClick={() => setOpen(false)}
        >
          <Logo height={32} />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label={nav.mainNav}>
          {navKeys.map((key) => (
            <Link
              key={key}
              href={pathFor(locale, key)}
              aria-current={isActive(key) ? "page" : undefined}
              className={`group hud flex items-center gap-1.5 px-3 py-2.5 !text-[0.9rem] !normal-case !tracking-normal transition-colors ${
                isActive(key) ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              <CaretRight
                size={12}
                weight="fill"
                aria-hidden
                className={`text-accent transition-opacity ${
                  isActive(key) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              />
              {nav[key]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitch locale={locale} label={nav.langLabel} />

          {/* Görünürlük sarmalayıcıda: .btn-px kendi display değerini taşıyor
              ve aynı öğedeki hidden/md:hidden sınıflarını eziyor. */}
          <div className="hidden sm:block">
            <Link href={pathFor(locale, "contact")} className="btn-px btn-primary btn-sm">
              <span className="px-notch px-box">{cta}</span>
            </Link>
          </div>

          <div className="md:hidden">
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="pause-menu"
            aria-label={open ? nav.close : nav.menu}
            className="btn-px btn-ghost btn-sm"
          >
            <span className="px-notch px-box !px-3">
              {open ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
            </span>
          </button>
          </div>
        </div>
      </Container>

      {open && (
        <div
          id="pause-menu"
          className="pause-menu bg-void fixed inset-x-0 top-16 bottom-0 md:hidden"
        >
          <Container className="flex h-full flex-col pt-10 pb-10">
            <p className="hud text-accent-text !text-base">{nav.paused}</p>
            <nav aria-label={nav.mainNav}>
            <ul className="mt-8 flex flex-col gap-1">
              {[...navKeys].map((key, index) => (
                <li key={key} style={{ animationDelay: `${80 + index * 60}ms` }}>
                  <Link
                    href={pathFor(locale, key)}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(key) ? "page" : undefined}
                    className="group font-display flex items-center gap-3 py-3 text-4xl font-bold"
                  >
                    <CaretRight
                      size={22}
                      weight="fill"
                      aria-hidden
                      className={`text-accent ${
                        isActive(key) ? "" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                      }`}
                    />
                    {nav[key]}
                  </Link>
                </li>
              ))}
            </ul>
            </nav>

            <div className="mt-auto flex flex-col gap-4">
              <Link
                href={pathFor(locale, "contact")}
                onClick={() => setOpen(false)}
                className="btn-px btn-primary w-full"
              >
                <span className="px-notch px-box w-full">{cta}</span>
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="hud text-muted hover:text-ink py-3 !text-sm"
              >
                {nav.resume}
              </button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}

function LocaleSwitch({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const current = parsePath(pathname);

  return (
    <div className="flex items-center" role="group" aria-label={label}>
      {locales.map((candidate, index) => (
        <span key={candidate} className="flex items-center">
          {index > 0 && <span className="text-faint hud px-0.5" aria-hidden>/</span>}
          <Link
            href={
              current?.game
                ? gamePath(candidate, current.game)
                : pathFor(candidate, current?.key ?? "home")
            }
            hrefLang={candidate}
            /*
             * Statik export'ta Next dinamik segmentli rotalar için geçersiz
             * bir RSC yolu isteyip 404 alıyor; site statik, ön getirmenin
             * kazancı yok.
             */
            prefetch={false}
            aria-current={candidate === locale ? "true" : undefined}
            className={`hud flex min-h-11 min-w-10 items-center justify-center px-2 !text-[0.8rem] transition-colors ${
              candidate === locale ? "text-ink" : "text-faint hover:text-muted"
            }`}
          >
            {candidate}
          </Link>
        </span>
      ))}
    </div>
  );
}
