import { ILanguage, Language } from '@wiki-types/enums/language';

export function getRandomLanguage(excludedCode: string): ILanguage {
  const candidates: ILanguage[] = Language.ALL.filter((language: ILanguage) => language.code !== excludedCode);

  if (candidates.length === 0) {
    throw Error(`No language to switch to: the pool contains only "${excludedCode}"`);
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}
