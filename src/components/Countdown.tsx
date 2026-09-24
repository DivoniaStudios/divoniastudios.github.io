"use client";

import { useEffect, useRef, useState } from "react";

/**
 * DEVAM? ekranındaki 9'dan 0'a sayaç. Sıfırdan sonra baştan başlıyor
 * (ziyaretçiyi "oyun bitti"ye göndermek bir tanıtım sitesinde anlamsız).
 * Ekrandan çıkınca ve hareket azaltmada durur; o durumda 9 gösterilir.
 */
export function Countdown() {
  const [value, setValue] = useState(9);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer = 0;
    const tick = () => setValue((current) => (current <= 0 ? 9 : current - 1));

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !timer) {
        timer = window.setInterval(tick, 1000);
      } else if (!entry.isIntersecting && timer) {
        window.clearInterval(timer);
        timer = 0;
      }
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timer) window.clearInterval(timer);
    };
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden
      className="font-pixel text-accent text-6xl font-semibold tabular-nums sm:text-8xl lg:text-9xl"
    >
      <span key={value} className="countdown-digit">
        {value}
      </span>
    </span>
  );
}
