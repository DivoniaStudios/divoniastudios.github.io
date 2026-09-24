import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import { Container } from "../Container";
import { PageHeader } from "../PageHeader";
import { ContactForm } from "../ContactForm";
import { socials } from "../Footer";
import type { Dictionary } from "@/i18n/dictionaries";

export function ContactContent({ dict }: { dict: Dictionary }) {
  const t = dict.contactPage;
  return (
    <>
      <PageHeader title={t.title} subtitle={t.subtitle} />
      <Container className="grid gap-12 pb-24 sm:pb-32 lg:grid-cols-12">
        <div className="lg:col-span-7" data-reveal>
          <ContactForm dict={dict} />
        </div>

        <aside className="lg:col-span-4 lg:col-start-9" data-reveal data-reveal-delay="120">
          <h2 className="hud text-faint">{t.direct}</h2>
          <a
            href={`mailto:${dict.footer.email}`}
            className="link-px mt-3 inline-flex min-h-11 items-center gap-2 text-lg break-all"
          >
            <EnvelopeSimple size={20} weight="fill" aria-hidden className="text-accent-text shrink-0" />
            {dict.footer.email}
          </a>

          <h2 className="hud text-faint mt-12">{t.social}</h2>
          <ul className="mt-3">
            {socials.map(({ name, href, Icon }) => (
              <li key={name}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group text-muted hover:text-ink inline-flex min-h-11 items-center gap-3 transition-colors"
                >
                  <Icon size={22} weight="fill" aria-hidden className="text-ink" />
                  {name}
                  <span className="sr-only">({dict.common.opensNewTab})</span>
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </Container>
    </>
  );
}
