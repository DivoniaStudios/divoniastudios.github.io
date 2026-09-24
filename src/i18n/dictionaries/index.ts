import type { Locale } from "../config";
import { tr, type Dictionary } from "./tr";
import { en } from "./en";

const dictionaries: Record<Locale, Dictionary> = { tr, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
