import type { Locale } from "@/i18n/config";

/**
 * Oyun listesi. Bilgiler Steam ve mağaza sayfalarından alındı; burada
 * olmayan bir özelliği (tarih, ödül, rakam) siteye eklemeden önce kaynağını
 * doğrula.
 *
 * Görseller public/games/<slug>/ altında, WebP.
 */

type Text = Record<Locale, string>;

export type Platform = "pc" | "ios" | "android" | "installation";

export type StoreLink = {
  kind: "steam" | "appstore" | "googleplay" | "web";
  href: string;
};

export type Character = {
  id: string;
  name: string;
  /** Oyunun içindeki profilden; yoksa boş bırak. */
  age?: string;
  role: Text;
  image: string;
};

export type Game = {
  slug: string;
  title: string;
  /** Stüdyonun kendi oyunu mu, bir müşteri için mi yapıldı */
  kind: "own" | "client";
  client?: string;
  platforms: Platform[];
  status: Text;
  year?: string;
  summary: Text;
  cover: string;
  coverSmall?: string;
  coverAlt: Text;
  links: StoreLink[];
  /** Detay sayfası olan oyunlar */
  hasPage?: boolean;
};

export const STEAM_URL =
  "https://store.steampowered.com/app/4622170/Date_For_Dead/";

export const games: Game[] = [
  {
    slug: "date-for-dead",
    title: "Date For Dead",
    kind: "own",
    platforms: ["pc"],
    status: { tr: "Erken Erişim · Yakında", en: "Early Access · Coming soon" },
    summary: {
      tr: "Canavarlarla insanların birlikte yaşadığı bir dünyada geçen, hikâye odaklı bir dating sim. Sağa kaydır. Aşık ol. Bedelini sorma.",
      en: "A narrative-driven dating sim set in a world where monsters and humans coexist. Swipe right. Fall in love. Don't ask what it costs.",
    },
    cover: "/games/date-for-dead/ss-1.webp",
    coverSmall: "/games/date-for-dead/ss-1-sm.webp",
    coverAlt: {
      tr: "Date For Dead: Valerie, kırmızı ışıklı bir barda",
      en: "Date For Dead: Valerie in a red-lit bar",
    },
    links: [{ kind: "steam", href: STEAM_URL }],
    hasPage: true,
  },
  {
    slug: "photosensia-kids",
    title: "PhotoSensia Kids",
    kind: "client",
    platforms: ["ios", "android"],
    status: { tr: "Yayında", en: "Live" },
    year: "2024",
    summary: {
      tr: "Küçük fotoğrafçılar için eğitici mobil oyun. Görevleri tamamla, fotoğrafın inceliklerini öğren, puan toplayıp seviye atla. Türkiye Fotoğraf Sanatı Federasyonu tarafından öneriliyor.",
      en: "An educational mobile game for little photographers. Complete tasks, learn the craft, collect points and level up. Recommended by the Photographic Arts Federation of Türkiye.",
    },
    cover: "/games/photosensia-kids/ss-1.webp",
    coverAlt: {
      tr: "PhotoSensia Kids ana ekranı: iki çocuk karakter ve görev menüsü",
      en: "PhotoSensia Kids home screen: two kid characters and the task menu",
    },
    links: [
      {
        kind: "appstore",
        href: "https://apps.apple.com/tr/app/photosensia-kids/id6624305795",
      },
      {
        kind: "googleplay",
        href: "https://play.google.com/store/apps/details?id=com.photosensia.photosensiaforkids",
      },
    ],
  },
  {
    slug: "kidzania",
    title: "Logo × KidZania",
    kind: "client",
    client: "Logo Yazılım",
    platforms: ["pc", "installation"],
    status: { tr: "Yayında", en: "Live" },
    summary: {
      tr: "KidZania İstanbul'daki Logo Yazılım Geliştirme Merkezi için geliştirdiğimiz PC oyunu. Merkeze gelen çocuklar oyunu oradaki bilgisayarlarda oynuyor.",
      en: "A PC game we built for Logo's Software Development Center at KidZania Istanbul. Kids visiting the center play it on the computers there.",
    },
    cover: "/games/kidzania/cover.webp",
    coverSmall: "/games/kidzania/cover-sm.webp",
    coverAlt: {
      tr: "KidZania İstanbul'daki Logo Yazılım Geliştirme Merkezi'nin girişi",
      en: "Entrance of Logo's Software Development Center at KidZania Istanbul",
    },
    links: [
      {
        kind: "web",
        href: "https://istanbul.kidzania.com/yazilim-gelistirme-merkezi",
      },
    ],
  },
];

export function getGame(slug: string): Game | undefined {
  return games.find((game) => game.slug === slug);
}

/** Date For Dead karakterleri. Tanımlar Steam sayfasındaki listeden. */
export const characters: Character[] = [
  {
    id: "valerie",
    name: "Valerie",
    age: "316",
    role: {
      tr: "Baştan çıkarıcı bir vampir yönetmen",
      en: "A bold and seductive vampire filmmaker",
    },
    image: "/games/date-for-dead/char-valerie.webp",
  },
  {
    id: "minos",
    name: "Minos Jr.",
    role: {
      tr: "Hassas ama tehlikeli bir minotaur",
      en: "A quiet but intense minotaur",
    },
    image: "/games/date-for-dead/char-minos.webp",
  },
  {
    id: "anpu",
    name: "Anpu",
    role: {
      tr: "Antik ve kibirli bir tanrı",
      en: "A narcissistic ancient god",
    },
    image: "/games/date-for-dead/char-anpu.webp",
  },
];

/** Ekran görüntüleri: detay sayfasındaki şerit */
export const screenshots = [1, 2, 3, 4, 5, 6].map((n) => ({
  full: `/games/date-for-dead/ss-${n}.webp`,
  small: `/games/date-for-dead/ss-${n}-sm.webp`,
}));
