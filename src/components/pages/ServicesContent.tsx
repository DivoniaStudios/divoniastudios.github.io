import { Container, SectionHeading } from "../Container";
import { PageHeader } from "../PageHeader";
import { SkillTree } from "../sections/SkillTree";
import { QuestLog } from "../sections/QuestLog";
import { ContinueScreen } from "../sections/ContinueScreen";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Hizmetler: yetenek ağacı, çalışma biçimi (oyun haritası gibi üç durak),
 * müşteri işleri ve son çağrı.
 */
export function ServicesContent({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.servicesPage;
  return (
    <>
      <PageHeader title={t.title} subtitle={t.subtitle} />
      <div className="-mt-16">
        <SkillTree locale={locale} dict={dict} showHeading={false} />
      </div>

      <section className="bg-deep border-line border-y py-24 sm:py-32">
        <Container>
          <SectionHeading title={t.processTitle} />

          {/* Harita: duraklar kesik bir yolla bağlı, her biri bir öncekinden aşağıda */}
          <ol className="relative mt-16 grid gap-10 lg:grid-cols-3 lg:gap-8">
            <span
              aria-hidden
              className="absolute top-5 right-[16%] left-[16%] hidden h-1 bg-[repeating-linear-gradient(90deg,var(--accent)_0_12px,transparent_12px_22px)] lg:block"
            />
            {t.process.map((step, index) => (
              <li
                key={step.title}
                data-reveal
                data-reveal-delay={String(index * 140)}
                className="relative flex gap-5 lg:flex-col lg:items-center lg:text-center"
              >
                <span
                  aria-hidden
                  className={`px-notch relative z-[1] flex h-11 w-11 shrink-0 items-center justify-center ${
                    index === t.process.length - 1 ? "bg-accent-fill" : "bg-panel-2 border-line-strong"
                  }`}
                >
                  <span className={`block h-3 w-3 ${index === t.process.length - 1 ? "bg-white" : "bg-accent"}`} />
                </span>
                <div className="lg:mt-6 lg:max-w-xs">
                  <h3 className="text-2xl font-bold">{step.title}</h3>
                  <p className="text-muted mt-3 leading-relaxed">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <QuestLog locale={locale} dict={dict} />
      <ContinueScreen locale={locale} dict={dict} />
    </>
  );
}
