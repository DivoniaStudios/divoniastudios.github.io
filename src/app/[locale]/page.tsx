import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { TitleStory } from "@/components/sections/TitleStory";
import { DateForDead } from "@/components/sections/DateForDead";
import { QuestLog } from "@/components/sections/QuestLog";
import { SkillTree } from "@/components/sections/SkillTree";
import { ContinueScreen } from "@/components/sections/ContinueScreen";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <TitleStory locale={locale} dict={dict} />
      <DateForDead locale={locale} dict={dict} />
      <QuestLog locale={locale} dict={dict} />
      <SkillTree locale={locale} dict={dict} />
      <ContinueScreen locale={locale} dict={dict} />
    </>
  );
}
