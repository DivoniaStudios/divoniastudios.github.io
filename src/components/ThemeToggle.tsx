"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "@phosphor-icons/react";

export const THEME_KEY = "divonia-theme";

type Theme = "dark" | "light";

/**
 * Gece / gündüz geçişi. İlk tema layout'taki betikte, boyamadan önce
 * seçiliyor (kayıtlı tercih, yoksa sistem ayarı); bu bileşen yalnızca
 * değiştiriyor ve tercihi saklıyor. Ziyaretçi hiç seçim yapmadıysa sistem
 * ayarı değiştiğinde site de onu izliyor.
 */
export function ThemeToggle({
  toLight,
  toDark,
}: {
  toLight: string;
  toDark: string;
}) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(root.dataset.theme === "light" ? "light" : "dark");

    const system = window.matchMedia("(prefers-color-scheme: light)");
    const onSystem = () => {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem(THEME_KEY);
      } catch {}
      if (saved) return;
      const next: Theme = system.matches ? "light" : "dark";
      apply(next);
      setTheme(next);
    };
    system.addEventListener("change", onSystem);
    return () => system.removeEventListener("change", onSystem);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    apply(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
    setTheme(next);
  };

  const label = theme === "light" ? toDark : toLight;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="btn-px btn-ghost btn-sm"
    >
      <span className="px-notch px-box !px-3">
        {/* İlk render'da tema henüz bilinmiyor; boş kalan yer zıplamasın */}
        {theme === null ? (
          <span className="block h-5 w-5" />
        ) : theme === "light" ? (
          <Moon size={20} weight="fill" aria-hidden />
        ) : (
          <Sun size={20} weight="fill" aria-hidden />
        )}
      </span>
    </button>
  );
}

function apply(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}
