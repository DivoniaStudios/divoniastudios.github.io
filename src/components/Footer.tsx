import Link from "next/link";
import {
  InstagramLogo,
  LinkedinLogo,
  SteamLogo,
} from "@phosphor-icons/react/dist/ssr";
import { Logo } from "./Logo";
import { Container } from "./Container";
import type { Locale } from "@/i18n/config";
import { pathFor, type PageKey } from "@/i18n/routes";
import { STEAM_URL } from "@/data/games";
import type { Dictionary } from "@/i18n/dictionaries";

export const socials = [
  { name: "Instagram", href: "https://www.instagram.com/divoniastudios/", Icon: InstagramLogo },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/divonia-studios/", Icon: LinkedinLogo },
  { name: "Steam", href: STEAM_URL, Icon: SteamLogo },
];

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const keys: PageKey[] = ["games", "services", "contact"];
  return (
    <footer className="border-line bg-deep/75 border-t">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href={pathFor(locale)} aria-label={dict.nav.home} className="inline-block">
              <Logo height={44} />
            </Link>
            <p className="text-muted mt-5 max-w-xs text-sm leading-relaxed">
              {dict.footer.tagline}
            </p>
          </div>

          <nav aria-label={dict.nav.mainNav}>
            <ul className="space-y-0.5">
              {keys.map((key) => (
                <li key={key}>
                  <Link
                    href={pathFor(locale, key)}
                    className="text-muted hover:text-ink inline-flex min-h-11 items-center text-sm transition-colors"
                  >
                    {dict.nav[key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <a href={`mailto:${dict.footer.email}`} className="link-px inline-flex min-h-11 items-center text-sm">
              {dict.footer.email}
            </a>
            <p className="hud text-faint mt-6">{dict.footer.follow}</p>
            <ul className="mt-3 flex gap-2">
              {socials.map(({ name, href, Icon }) => (
                <li key={name}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${name} (${dict.common.opensNewTab})`}
                    className="btn-px btn-ghost btn-sm"
                  >
                    <span className="px-notch px-box !px-3">
                      <Icon size={20} weight="fill" aria-hidden />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="border-line text-faint mt-12 border-t pt-6 text-xs">
          © {new Date().getFullYear()} {dict.meta.siteName}. {dict.footer.rights}
        </p>
      </Container>
    </footer>
  );
}
