import {
  BrowserContext,
  Page,
  PlaywrightTestArgs,
  PlaywrightTestOptions,
  PlaywrightWorkerArgs,
  PlaywrightWorkerOptions,
  TestType,
  test,
} from '@playwright/test';
import { ILanguage, Language } from '@wiki-types/enums/language';

import { WikipediaApp } from '@wiki-app/index';

interface WikipediaContext {
  wiki: WikipediaApp;
  restoreInterfaceLanguage: (language?: ILanguage) => Promise<void>;
}

export type WikipediaTest = TestType<
  PlaywrightTestArgs & PlaywrightTestOptions & WikipediaContext,
  PlaywrightWorkerArgs & PlaywrightWorkerOptions
>;

export const wikipediaFixture: WikipediaTest = test.extend<WikipediaContext>({
  wiki: async (
    { page, context }: { page: Page; context: BrowserContext },
    use: (app: WikipediaApp) => Promise<void>,
  ): Promise<void> => {
    await use(new WikipediaApp(page, context));
  },

  restoreInterfaceLanguage: async (
    { page, context }: { page: Page; context: BrowserContext },
    use: (restore: (language?: ILanguage) => Promise<void>) => Promise<void>,
  ): Promise<void> => {
    const wiki: WikipediaApp = new WikipediaApp(page, context);

    await use(async (language: ILanguage = Language.ENGLISH): Promise<void> => {
      await test.step(`Restoring interface language to "${language.code}"`, async () => {
        await wiki.preferences.open();

        // eslint-disable-next-line playwright/no-conditional-in-test
        if ((await wiki.preferences.getSelectedInterfaceLanguage()) !== language.code) {
          await wiki.preferences.changeInterfaceLanguage(language);
        }
      });
    });
  },
});
