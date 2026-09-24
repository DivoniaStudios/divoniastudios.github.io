"use client";

import { useEffect } from "react";

/**
 * Sayfa kaydırmasına atalet ekler.
 *
 * Fare tekerleği sayfayı ~100 piksellik sert adımlarla ilerletiyor; kaydırmaya
 * bağlı her şey (paneller, HUD, video) bu sertliği devralıyordu. Lenis hedef
 * konuma yumuşayarak gidiyor ve gerçek scroll konumunu güncellediği için
 * mevcut scroll dinleyicileri olduğu gibi çalışmaya devam ediyor.
 *
 * `prefers-reduced-motion` seçiliyse hiç devreye girmez; tarayıcının kendi
 * kaydırması kullanılır.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    let lenis: { raf: (time: number) => void; destroy: () => void } | null =
      null;
    let frame = 0;
    let cancelled = false;

    void import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;

      lenis = new Lenis({
        /*
         * Süre yerine lerp kullanılıyor: süre tabanlı yumuşatma her tekerlek
         * hareketini sabit bir animasyona bağlıyor ve sayfa "sürükleniyor" gibi
         * hissettiriyordu. lerp her karede hedefe belli bir oranda yaklaşır;
         * hareket hemen başlar, hızlıca oturur.
         */
        lerp: 0.14,
        // Dokunmatikte tarayıcının kendi kaydırması daha iyi
        syncTouch: false,
        touchMultiplier: 1.5,
        wheelMultiplier: 1,
      });

      const loop = (time: number) => {
        lenis?.raf(time);
        frame = requestAnimationFrame(loop);
      };
      frame = requestAnimationFrame(loop);
    });

    return () => {
      cancelled = true;
      if (frame) cancelAnimationFrame(frame);
      lenis?.destroy();
    };
  }, []);

  return null;
}
