export class Constants {
  public static readonly THIRTY_SECONDS: number = 30000;
  public static readonly SIXTY_SECONDS: number = 60000;
  public static readonly TWO_MINUTES: number = 120000;

  public static readonly UKRAINE_ARTICLE_NAME: string = 'Ukraine';
  public static readonly TYPING_DELAY: number = 50;
  public static readonly LANGUAGE_OPTION_SEPARATOR: string = ' · ';
  public static readonly USER_AGENT: string = 'wikipedia-aqa/1.0 (Playwright E2E tests)';

  public static readonly PREFERENCES_PERSONAL_SECTION: string = '#mw-prefsection-personal';
  public static readonly PREFERENCES_I18N_SUBSECTION: string = '#mw-prefsection-personal-i18n';
  public static readonly PREFERENCES_LANGUAGE_FIELD: string = '#mw-htmlform-i18n';
}
