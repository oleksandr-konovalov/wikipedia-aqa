import { ILanguage, Language } from '@wiki-types/enums/language';
import { Locator, expect } from '@playwright/test';

import { AppPage } from '../abstractClass';
import { Constants } from '@wiki-test-data/constants/constants';
import { env } from '@wiki-helpers/base';
import { logStep } from '@wiki-utils/logStep';

export class Article extends AppPage {
  private title: Locator = this.page.locator('#firstHeading .mw-page-title-main');
  private content: Locator = this.page.locator('#mw-content-text');

  public async expectLoaded(): Promise<void> {
    await expect(this.content, 'Expected article content to be visible').toBeVisible({
      timeout: Constants.THIRTY_SECONDS,
    });
  }

  public async openByName(name: string): Promise<void> {
    await this.open(`${env('BASE_URL')}/wiki/${name}`);
  }

  @logStep('Open the article in the selected language')
  public async openInLanguage(language: ILanguage): Promise<void> {
    const interlanguageLink: Locator = this.page.locator(`.interlanguage-link a[lang="${language.code}"]`).first();

    await expect(interlanguageLink, `Expect interlanguage link to "${language.nativeName}" to exist`).toHaveAttribute(
      'href',
      /wikipedia\.org/,
    );

    await this.open((await interlanguageLink.getAttribute('href')) ?? undefined);
  }

  @logStep('Check article title')
  public async expectTitle(title: string): Promise<void> {
    await expect(this.title, `Expect article title to be "${title}"`).toHaveText(title);
  }

  @logStep('Check the article is displayed in the selected language')
  public async expectRenderedInLanguage(language: ILanguage = Language.ENGLISH): Promise<void> {
    await this.expectURL(new RegExp(`^https://${language.code}\\.wikipedia\\.org/`));
    await this.expectTitle(language.ukraineArticleTitle);
    await this.expectInterfaceLanguageCode(language.code);
  }
}
