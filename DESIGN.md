# Divonia Studios: tasarım sistemi

Bu dosya sitenin görsel kurallarıdır. Yeni bir bölüm eklerken önce burayı oku.
Değerlerin kendisi `src/app/globals.css` içindeki `:root` bloğunda.

## Okuma

Oyun stüdyosu sitesi; iki kitle: oyuncular (Date For Dead) ve markalar
(özel oyun işi). Dil: **oyun arayüzü**. Stüdyonun kabuğu logodaki piksel
dilinden (HUD, piksel köşe, sert gölge), Date For Dead bölümleri oyunun kendi
arayüzünden (görsel roman diyalog kutusu, monsterCELL uygulaması) gelir.

Referanslar: logo (piksel kalp), Date For Dead ekran görüntüleri
(`public/games/date-for-dead/`), klasik oyun menüleri (PRESS START,
DURAKLATILDI, DEVAM?).

## Tokenlar

| Token | Değer | Kullanım |
|---|---|---|
| `--void` | `#0B0A10` | Sayfa zemini |
| `--deep` | `#12101A` | Bölüm tonu |
| `--panel` | `#1A1724` | Yükseltilmiş yüzey |
| `--ink` | `#F1ECF4` | Ana metin (16.9:1) |
| `--muted` | `#A9A2B8` | İkincil metin (8.0:1) |
| `--faint` | `#8F88A3` | Küçük etiketler (5.8:1) |
| `--accent` | `#EC1F27` | Logo kırmızısı; büyük öğeler, dekor |
| `--accent-text` | `#FF4B53` | Koyu zeminde kırmızı metin (6.0:1) |
| `--accent-fill` | `#D8141D` | Buton zemini, üstünde beyaz metin (5.2:1) |
| `--paper` | `#EFE8DA` | Yalnızca oyunun diyalog kutusu |
| `--paper-ink` | `#2A2530` | Diyalog kutusundaki metin (12.3:1) |

İki tema: **gece** (varsayılan) ve **gündüz**. İlk açılışta sistem ayarı
izlenir, üst menüdeki butonla değiştirilir, tercih tarayıcıda saklanır.
Gündüz tokenları `globals.css` içinde `[data-theme="light"]` bloğunda;
yukarıdaki tablo gece değerleri. Gündüz modunda voksel kalp logonun orijinal
renkleriyle çizilir (siyah çerçeve, kırmızı gövde). Temaya göre değişen
görseller `.only-dark` / `.only-light` sınıflarıyla seçilir.

Tek vurgu rengi kırmızıdır. Oyun görselleri kendi renklerini getirir;
arayüz yeni renk eklemez.

## Arka plan

Seviye editörü ızgarası: oyun motorlarının sahne düzenleyicisindeki gibi
48px karolar ve her dört karede bir kesişim işareti (+). `body` zemininde
duruyor (`--grid-line`, `--grid-plus`); üstte ayrı bir katman yok, bu yüzden
telefonda kaydırma maliyeti yok. Açılıştaki voksel sahnesi aynı ızgarayı
shader içinde çiziyor. Koyu tonlu bölümler (`bg-deep/75`) yarı saydam;
ızgara onların altından da hafifçe görünüyor.

## Tipografi

- **Başlık:** Bricolage Grotesque, 700-800, sıkı aralık.
- **Metin:** Geist, 400-500, satır en fazla 65 karakter.
- **Piksel:** Pixelify Sans. Yalnızca büyük ve dekoratif yerlerde: DEVAM?,
  sayaç, HUD'daki büyük rakamlar, oyunun arayüz parçaları (diyalog sekmesi,
  monsterCELL). Buton, etiket ve menüde kullanılmaz; küçük boyutta
  okunmuyor. Oyun hissini oralarda çentikli köşe ve sert gölge taşıyor.

Üçü de Türkçe karakterleri (ğ ş ı İ) içerir.

## Biçim

- **Köşe:** yuvarlak köşe yok. Etkileşimli öğeler ve paneller 8-bit
  "çentikli köşe" kullanır (`.px-notch`). Görseller düz köşe.
- **Gölge:** bulanık gölge yok. Butonlarda sert, kaydırılmış piksel gölge;
  basınca buton gölgesine iner.
- **Çizgi:** 1px, `--line`.
- **İstisna:** Date For Dead'in telefonu ve diyalog kutusu oyunun kendi
  arayüzünü taklit ediyor (yuvarlak telefon, açık zeminli kutu). Bu iki
  bileşen köşe ve renk kuralının dışında; başka yerde kullanılmaz.

## Hareket

Her animasyonun bir gerekçesi var:

| Hareket | Gerekçe |
|---|---|
| Voksel kalp sahnesi | Açılış anlatısı: 8-bit'ten HD'ye, fikirden oyuna |
| Kelime kelime başlık | Hiyerarşi: ilk okunacak şey |
| Kaydırınca belirme | Bölüm sırası |
| Sağa/sola kaydırma destesi | Date For Dead'in kendi mekaniği |
| Diyalog kutusu yazımı | Görsel roman anlatımı |
| Yetenek ağacı çizgileri | Hizmet ile kanıt projesi arasındaki bağ |
| DEVAM? sayacı | Son çağrıya dikkat |

`prefers-reduced-motion: reduce` seçiliyse hepsi kapanır, içerik doğrudan
görünür.

## Yasaklar

- Emoji yok. İkonlar Phosphor'dan.
- Pembe/beyaz cam kart yok, `backdrop-filter` yalnızca üst menüde.
- Mor degrade, neon parıltı yok.
- Inter, Roboto, Orbitron yok.
- Uzun tire (—) yok; normal tire kullan.
- "Hayalleri gerçeğe dönüştürüyoruz", "üst düzey", "güvenilir iş ortağı"
  gibi genel sloganlar yok. Somut yaz.
- Uydurma rakam, müşteri, ödül yok. Oyun bilgileri Steam ve mağaza
  sayfalarından alınır.
