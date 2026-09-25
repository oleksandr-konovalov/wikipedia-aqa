export interface ILanguage {
  code: string;
  nativeName: string;
  preferencesTitle: string;
  historyTabName: string;
  ukraineArticleTitle: string;
}

export class Language {
  public static readonly ENGLISH: ILanguage = {
    code: 'en',
    nativeName: 'English',
    preferencesTitle: 'Preferences',
    historyTabName: 'View history',
    ukraineArticleTitle: 'Ukraine',
  };

  public static readonly UKRAINIAN: ILanguage = {
    code: 'uk',
    nativeName: 'українська',
    preferencesTitle: 'Налаштування',
    historyTabName: 'Переглянути історію',
    ukraineArticleTitle: 'Україна',
  };

  public static readonly GERMAN: ILanguage = {
    code: 'de',
    nativeName: 'Deutsch',
    preferencesTitle: 'Einstellungen',
    historyTabName: 'Versionsgeschichte',
    ukraineArticleTitle: 'Ukraine',
  };

  public static readonly FRENCH: ILanguage = {
    code: 'fr',
    nativeName: 'français',
    preferencesTitle: 'Préférences',
    historyTabName: 'Voir l’historique',
    ukraineArticleTitle: 'Ukraine',
  };

  public static readonly SPANISH: ILanguage = {
    code: 'es',
    nativeName: 'español',
    preferencesTitle: 'Preferencias',
    historyTabName: 'Ver historial',
    ukraineArticleTitle: 'Ucrania',
  };

  public static readonly POLISH: ILanguage = {
    code: 'pl',
    nativeName: 'polski',
    preferencesTitle: 'Preferencje',
    historyTabName: 'Wyświetl historię',
    ukraineArticleTitle: 'Ukraina',
  };

  public static readonly ITALIAN: ILanguage = {
    code: 'it',
    nativeName: 'italiano',
    preferencesTitle: 'Preferenze',
    historyTabName: 'Cronologia',
    ukraineArticleTitle: 'Ucraina',
  };

  public static readonly DUTCH: ILanguage = {
    code: 'nl',
    nativeName: 'Nederlands',
    preferencesTitle: 'Voorkeuren',
    historyTabName: 'Geschiedenis weergeven',
    ukraineArticleTitle: 'Oekraïne',
  };

  public static readonly ALL: ILanguage[] = [
    Language.ENGLISH,
    Language.UKRAINIAN,
    Language.GERMAN,
    Language.FRENCH,
    Language.SPANISH,
    Language.POLISH,
    Language.ITALIAN,
    Language.DUTCH,
  ];
}
