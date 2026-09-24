"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Sayfadaki tek istemci adası. Üç iş yapar:
 *  1. [data-reveal] öğelerini görünür olunca açar
 *  2. İmleç konumunu :root üzerinde --px / --py olarak yayınlar
 *  3. [data-spotlight] kartlarında imleç konumunu --cx / --cy yapar
 *
 * JS çalışmazsa hiçbiri devreye girmez ve sayfa tamamen görünür kalır.
 */
export function Motion() {
  const pathname = usePathname();

  // 1. Kaydırınca beliren bölümler
  //
  // IntersectionObserver yerine doğrudan konum ölçümü kullanılıyor: tarayıcı
  // sekmeyi arka plana aldığında IO geri çağrıları askıya alınabiliyor ve
  // bölümler görünmez kalıyor. Bir tanıtım sitesinde içeriğin görünmemesi
  // kabul edilebilir bir hata değil, bu yüzden ölçüm scroll/resize üzerinden
  // yapılıyor ve her durumda sonuç veriyor.
  useEffect(() => {
    const root = document.documentElement;
    let pending = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    if (pending.length === 0) return;

    root.dataset.revealRoot = "on";

    const reveal = (el: HTMLElement) => {
      const delay = Number(el.dataset.revealDelay ?? 0);
      if (delay > 0) {
        window.setTimeout(() => el.classList.add("is-visible"), delay);
      } else {
        el.classList.add("is-visible");
      }
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      pending.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    // requestAnimationFrame arka plandaki sekmelerde duraklatıldığı için
    // kısıtlama zamanlayıcıyla yapılıyor; setTimeout her durumda çalışır.
    let timer = 0;

    const check = () => {
      timer = 0;
      const limit = window.innerHeight * 0.88;
      const still: HTMLElement[] = [];
      for (const el of pending) {
        if (el.getBoundingClientRect().top < limit) reveal(el);
        else still.push(el);
      }
      pending = still;
      if (pending.length === 0) detach();
    };

    const schedule = () => {
      if (!timer) timer = window.setTimeout(check, 60);
    };

    function detach() {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
    }

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", schedule);
    check();

    return () => {
      detach();
      if (timer) clearTimeout(timer);
    };
  }, [pathname]);

  // 2. + 3. İmleç efektleri — dokunmatik cihazlarda ve hareket azaltmada çalışmaz
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    const root = document.documentElement;
    let frame = 0;
    let x = 0;
    let y = 0;

    const apply = () => {
      frame = 0;
      root.style.setProperty("--px", x.toFixed(4));
      root.style.setProperty("--py", y.toFixed(4));
    };

    let lastCard: HTMLElement | null = null;

    const onMove = (event: PointerEvent) => {
      x = event.clientX / window.innerWidth - 0.5;
      y = event.clientY / window.innerHeight - 0.5;
      if (!frame) frame = requestAnimationFrame(apply);

      const card = (event.target as Element | null)?.closest<HTMLElement>(
        "[data-spotlight]",
      );
      if (card !== lastCard && lastCard) {
        // Karttan çıkıldı: eğim sıfırlansın, yoksa kart yamuk kalıyor.
        lastCard.style.setProperty("--tx", "0");
        lastCard.style.setProperty("--ty", "0");
      }
      lastCard = card ?? null;

      if (card) {
        const box = card.getBoundingClientRect();
        const left = event.clientX - box.left;
        const top = event.clientY - box.top;
        card.style.setProperty("--cx", `${left}px`);
        card.style.setProperty("--cy", `${top}px`);
        // -0.5 … 0.5 arası; CSS bunu eğim açısına çeviriyor.
        card.style.setProperty("--tx", (left / box.width - 0.5).toFixed(3));
        card.style.setProperty("--ty", (top / box.height - 0.5).toFixed(3));
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
