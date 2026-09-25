import { ILanguage, Language } from '@wiki-types/enums/language';
import { WikipediaTest, wikipediaFixture } from '@wiki-fixtures/wikipedia.fixture';

import { Constants } from '@wiki-test-data/constants/constants';
import { getRandomLanguage } from '@wiki-helpers/language.helper';

const test: WikipediaTest = wikipediaFixture;

test.describe(
  'WIKI-1 Authorized user changes the interface language of the application',
  { tag: ['@preferences', '@i18n'] },
  () => {
    test.afterEach(async ({ restoreInterfaceLanguage }) => {
      await restoreInterfaceLanguage(Language.ENGLISH);
    });

    test(
      'Interface is displayed in the language chosen in Preferences > User profile > Internationalisation',
      { tag: ['@smoke', '@regression'] },
      async ({ wiki }) => {
        let selectedLanguage: ILanguage = Language.ENGLISH;

        await test.step('Open Preferences as an authorized user', async () => {
          await wiki.preferences.open();
          await wiki.preferences.expectRenderedInLanguage(Language.ENGLISH);
        });

        await test.step('Open "User profile" tab and find the "Internationalisation" section', async () => {
          await wiki.preferences.openUserProfileTab();
          await wiki.preferences.expectInternationalisationSectionLoaded();
        });

        await test.step('Select a random interface language other than the current one and save', async () => {
          selectedLanguage = getRandomLanguage(await wiki.preferences.getSelectedInterfaceLanguage());

          await wiki.preferences.selectInterfaceLanguage(selectedLanguage);
          await wiki.preferences.save();
        });

        await test.step('Check Preferences are displayed in the chosen language', async () => {
          await wiki.preferences.expectRenderedInLanguage(selectedLanguage);
          await wiki.preferences.interfaceLanguageDropdown.expectSelectedValue(selectedLanguage.code);
        });

        await test.step('Check the chosen language is applied to the "Ukraine" article page', async () => {
          await wiki.article.openByName(Constants.UKRAINE_ARTICLE_NAME);
          await wiki.article.expectInterfaceLanguageCode(selectedLanguage.code);
        });

        await test.step('Check the "Ukraine" article title is displayed in the chosen language', async () => {
          await wiki.article.openInLanguage(selectedLanguage);
          await wiki.article.expectRenderedInLanguage(selectedLanguage);
        });
      },
    );
  },
);
