# Divonia Studios · divoniastudios.com

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · TR/EN.
Statik site olarak derlenir, GitHub Pages'te yayınlanır. Görsel kurallar
`DESIGN.md` içinde.

## Çalıştırma

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # statik siteyi out/ klasörüne üretir
npm run lint
```

## Yayın

`main` dalına her push, `.github/workflows/deploy.yml` üzerinden siteyi
derleyip yayınlar. **İlk seferde bir ayar gerekiyor:** deponun
Settings → Pages → Build and deployment → Source alanı **GitHub Actions**
olmalı (eski site "Deploy from a branch" ile yayınlanıyordu). Özel alan adı
aynı sayfadaki Custom domain alanında durur.

## Yapı

```
src/
  app/[locale]/            Kök layout; html lang dile göre
    page.tsx               Ana sayfa
    [page]/page.tsx        Oyunlar / Hizmetler / İletişim
    [page]/[slug]/         Oyun detay (şimdilik Date For Dead)
  components/
    sections/TitleStory    Açılış: voksel kalp + 4 seviyeli panel + HUD
    VoxelHeart.tsx         Logodaki kalbin WebGL voksel sahnesi
    MatchDeck.tsx          Date For Dead karakter destesi (sağa/sola kaydır)
    DialogueBox.tsx        Görsel roman diyalog kutusu (yazılan metin)
    sections/SkillTree     Hizmetler, yetenek ağacı olarak
    sections/QuestLog      Müşteri işleri, görev kaydı olarak
    sections/ContinueScreen  "DEVAM?" son çağrı
    Motion.tsx             Kaydırınca belirme + imleç ışığı/eğim
  i18n/                    routes.ts URL'lerin tek kaynağı; tr.ts kaynak dil
  data/games.ts            Oyunlar ve Date For Dead karakterleri
public/
  games/<slug>/            WebP görseller
  brand/                   Logo (koyu zemin sürümü), favicon, OG görseli
  index.html               Kök adres (/) için dil algılayan yönlendirme
tools/404.html             "GAME OVER" sayfası; derleme sonrası out/'a kopyalanır
```

## Sık yapılacak işler

**Metin** → `src/i18n/dictionaries/tr.ts` ve `en.ts`. İkisi aynı yapıda
olmak zorunda; `en.ts` eksik alan bırakırsa derleme hata verir.

**Oyun eklemek** → `src/data/games.ts`. Detay sayfası isteniyorsa
`hasPage: true`; sayfa `/tr/oyunlar/<slug>` adresinde otomatik üretilir.

**Date For Dead karakteri eklemek** → aynı dosyada `characters`. Görsel
3:4 oranında, `public/games/date-for-dead/char-<id>.webp`.

**Renk / font** → `src/app/globals.css` başındaki `:root` (gece) ve
`[data-theme="light"]` (gündüz) blokları; kurallar `DESIGN.md`.

## Voksel kalp

`VoxelHeart.tsx` logodaki kalbi 20×16'lık bir ızgaradan (`HEART` dizisi,
`#` kırmızı gövde, `o` açık çerçeve) üç boyutlu vokseller olarak çizer.
Tuval cihaz çözünürlüğüne yakın çizilir (piksel bütçesiyle sınırlı);
seviye ilerledikçe hafifçe keskinleşir (`LEVELS`). Renkler CSS
tokenlarından okunur, tema değişince sahne de değişir. WebGL yoksa CSS
degradesi görünür, hareket azaltmada tek kare çizilir.

## Kısıtlar

Site statik; sunucu tarafı kod yok. İletişim formu ziyaretçinin e-posta
uygulamasında hazır mesaj açar (`ContactForm.tsx`).
