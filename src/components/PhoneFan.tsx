/**
 * PhotoSensia Kids görseli: gerçek telefon çerçeveleri içinde üç ekran,
 * ortadaki önde ve büyük, yandakiler hafif eğik ve arkada. Zemin sitenin
 * koyu dilinde; uygulamanın mavisi yalnızca arkadaki hafif ışıkta.
 *
 * Telefonlar kabın yüksekliğine göre boyutlanıyor ve altta bilinçli olarak
 * taşıyor; böylece kap ne kadar genişlerse genişlesin boş mavi alan kalmıyor.
 * Üzerine gelince yandaki telefonlar biraz açılıyor.
 */
const phones = [
  { src: "/games/photosensia-kids/ss-4.webp", pos: "left" },
  { src: "/games/photosensia-kids/ss-6.webp", pos: "right" },
  { src: "/games/photosensia-kids/ss-1.webp", pos: "center" },
] as const;

const placement: Record<(typeof phones)[number]["pos"], string> = {
  left: "left-1/2 h-[92%] -translate-x-[118%] rotate-[-9deg] group-hover:-translate-x-[126%] group-hover:rotate-[-12deg]",
  right: "left-1/2 h-[92%] translate-x-[18%] rotate-[9deg] group-hover:translate-x-[26%] group-hover:rotate-[12deg]",
  center: "left-1/2 z-[2] h-[112%] -translate-x-1/2 group-hover:-translate-y-2",
};

export function PhoneFan({ className = "" }: { className?: string }) {
  return (
    <div
      className={`group relative overflow-hidden bg-[radial-gradient(ellipse_60%_70%_at_50%_85%,rgb(58_167_223/0.28),transparent_70%),radial-gradient(circle_at_1px_1px,rgb(241_236_244/0.07)_1px,transparent_0)] bg-[length:auto,14px_14px] ${className}`}
    >
      {phones.map(({ src, pos }) => (
        <div
          key={src}
          className={`absolute top-[14%] aspect-[600/1300] rounded-[1.4rem] bg-[#26222c] p-[3.5%] shadow-[inset_0_0_0_2px_#3a3541,0_30px_60px_-20px_rgb(0_0_0/0.85)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${placement[pos]}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            width={600}
            height={1300}
            loading="lazy"
            decoding="async"
            className="h-full w-full rounded-[1rem] object-cover object-top"
          />
        </div>
      ))}
      {/* Alt kenarda karta doğru kararma: telefonlar kartın içine akıyor */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-[3] h-1/4 bg-gradient-to-t from-[var(--panel)] to-transparent"
      />
    </div>
  );
}
