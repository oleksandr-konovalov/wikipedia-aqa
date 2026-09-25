import { type BrowserContext, type Page, expect } from '@playwright/test';

import { logStep } from '@wiki-utils/logStep';

export abstract class PageHolder {
  public constructor(
    protected page: Page,
    protected context: BrowserContext,
  ) {}
}

export abstract class Component extends PageHolder {
  public abstract expectLoaded(): Promise<void>;
}

export abstract class AppPage extends Component {
  // Pages without a fixed URL (article pages, for example) are always opened with an explicit path
  public pagePath?: string;

  public async open(path?: string): Promise<void> {
    await this.openWithoutLoadingCheck(path);
    await this.expectLoaded();
  }

  public async openWithoutLoadingCheck(path?: string): Promise<void> {
    const url: string | undefined = path ?? this.pagePath;

    if (!url) {
      throw Error(`${this.constructor.name} has no pagePath, pass the path to open() explicitly`);
    }

    await this.page.goto(url);
  }

  @logStep('Check page has URL')
  public async expectURL(url: string | RegExp): Promise<void> {
    await expect(this.page, `Expect page to have URL: ${url}`).toHaveURL(url);
  }

  @logStep('Check interface language of the page')
  public async expectInterfaceLanguageCode(languageCode: string): Promise<void> {
    await expect(this.page.locator('html'), `Expect interface to be rendered in "${languageCode}"`).toHaveAttribute(
      'lang',
      languageCode,
    );
  }
}
