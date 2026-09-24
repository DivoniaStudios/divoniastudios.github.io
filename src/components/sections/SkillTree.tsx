import Link from "next/link";
import {
  GameController,
  DeviceMobile,
  Storefront,
  Cube,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import type { IconProps } from "@phosphor-icons/react";
import { Container, SectionHeading } from "../Container";
import type { Locale } from "@/i18n/config";
import { gamePath, pathFor } from "@/i18n/routes";
import { getGame } from "@/data/games";
import type { Dictionary } from "@/i18n/dictionaries";

const icons: Record<string, React.ComponentType<IconProps>> = {
  custom: GameController,
  mobile: DeviceMobile,
  brand: Storefront,
  unity: Cube,
};

type Skill = Dictionary["skills"]["items"][number];

/**
 * Hizmetler, oyunlardaki yetenek ağacı gibi: kökte stüdyo, gövdede özel oyun
 * geliştirme, dallarda uzmanlıklar. Her düğüm, o yeteneğin kanıtı olan
 * oyuna bağlanıyor; kanıtı olmayan düğümde bağlantı yok.
 *
 * Bağlantılar görünür olunca sırayla çiziliyor (--d gecikmeleriyle):
 * kök → gövde → yatay dal → alt düğümler.
 */
export function SkillTree({
  locale,
  dict,
  showHeading = true,
}: {
  locale: Locale;
  dict: Dictionary;
  showHeading?: boolean;
}) {
  const [trunk, ...branches] = dict.skills.items;
  // Dallar hafif kademeli: ağaç, eşit kutu sırası gibi görünmesin. Kademe
  // dal çizgisinin uzunluğuyla veriliyor; margin olsaydı çizgi yatay dala
  // değmezdi.
  const stems = ["lg:h-10", "lg:h-24", "lg:h-16"];

  return (
    <section className="py-24 sm:py-32">
      <Container>
        {showHeading && (
          <SectionHeading title={dict.skills.title} intro={dict.skills.intro} />
        )}

        <div className="skill-tree mt-16 flex flex-col items-center" data-reveal>
          {/* Kök: stüdyonun piksel kalbi */}
          <div className="tree-node flex flex-col items-center" style={{ ["--d" as string]: "0s" }}>
            {/* Temaya göre: gece açık çerçeveli, gündüz siyah çerçeveli kalp */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/mark.png"
              alt=""
              width={64}
              height={64}
              className="only-dark h-16 w-16 [image-rendering:pixelated]"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/mark-on-light.png"
              alt=""
              width={64}
              height={64}
              className="only-light h-16 w-16 [image-rendering:pixelated]"
            />
          </div>
          <span className="tree-v h-12" style={{ ["--d" as string]: "0.2s" }} aria-hidden />

          <div className="w-full max-w-md">
            <SkillNode skill={trunk} locale={locale} dict={dict} delay="0.5s" featured />
          </div>

          <span className="tree-v h-12" style={{ ["--d" as string]: "0.8s" }} aria-hidden />
          {/* Yatay dal: yalnızca geniş ekranda, üç sütunun ortalarını bağlar.
              Genişlik: iki sütun + bir boşluk (gap 1.5rem → 2/3 + 1rem). */}
          <span
            className="tree-h hidden w-[calc(66.6667%+1rem)] lg:block"
            style={{ ["--d" as string]: "1s" }}
            aria-hidden
          />

          <ul className="grid w-full gap-4 lg:grid-cols-3 lg:gap-6">
            {branches.map((skill, index) => (
              <li key={skill.id} className="flex flex-col items-center">
                <span
                  className={`tree-v hidden lg:block ${stems[index] ?? "lg:h-10"}`}
                  style={{ ["--d" as string]: "1.35s" }}
                  aria-hidden
                />
                <SkillNode
                  skill={skill}
                  locale={locale}
                  dict={dict}
                  delay={`${1.55 + index * 0.12}s`}
                />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

function SkillNode({
  skill,
  locale,
  dict,
  delay,
  featured = false,
}: {
  skill: Skill;
  locale: Locale;
  dict: Dictionary;
  delay: string;
  featured?: boolean;
}) {
  const Glyph = icons[skill.id] ?? Cube;
  const game = skill.game ? getGame(skill.game) : undefined;
  const href = game
    ? game.hasPage
      ? gamePath(locale, game.slug)
      : `${pathFor(locale, "games")}#${game.slug}`
    : undefined;

  return (
    <div
      className="tree-node px-notch px-box spotlight w-full p-6"
      data-spotlight
      style={
        {
          "--d": delay,
          ...(featured ? { "--px-border": "var(--accent)" } : {}),
        } as React.CSSProperties
      }
    >
      <div className="relative z-[3] flex items-start gap-4">
        <span
          className={`px-notch flex h-11 w-11 shrink-0 items-center justify-center ${
            featured ? "bg-accent-fill text-white" : "bg-panel-2 text-accent-text"
          }`}
          aria-hidden
        >
          <Glyph size={22} weight="fill" />
        </span>
        <div>
          <h3 className="text-xl leading-tight font-bold">{skill.title}</h3>
          <p className="text-muted mt-2 text-sm leading-relaxed">{skill.text}</p>
          {game && href && (
            <Link
              href={href}
              className="group hud text-ink mt-2 inline-flex min-h-11 items-center gap-1.5 !text-[0.8rem]"
            >
              <span className="text-faint">{dict.skills.proof}:</span>
              <span className="border-accent border-b-2 pb-0.5">{game.title}</span>
              <ArrowRight size={13} weight="bold" aria-hidden className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
