/**
 * PhotoSensia Kids görseli: uygulamanın kendi mavisi üzerinde üç telefon
 * ekranı. Kare/yatay alanlarda dik ekran görüntüsünü kırpmak yerine
 * kullanılıyor.
 */
export function PhoneFan({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative flex items-end justify-center gap-3 overflow-hidden bg-[linear-gradient(180deg,#3aa7df,#1f6fb8)] px-6 pt-8 ${className}`}
    >
      {[1, 3, 6].map((n, index) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={n}
          src={`/games/photosensia-kids/ss-${n}.webp`}
          alt=""
          width={600}
          height={1300}
          loading="lazy"
          decoding="async"
          className={`w-[30%] max-w-[9.5rem] shadow-[0_18px_40px_-16px_rgb(0_0_0/0.6)] ${
            index === 1 ? "-mb-2" : "mb-[-18%]"
          }`}
        />
      ))}
    </div>
  );
}
