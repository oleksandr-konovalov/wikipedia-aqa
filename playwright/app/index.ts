import { BrowserContext, Page } from '@playwright/test';

import { Article } from '@wiki-pages/article.page';
import { Preferences } from '@wiki-pages/preferences.page';

export class WikipediaApp {
  public readonly preferences: Preferences;
  public readonly article: Article;

  public constructor(page: Page, context: BrowserContext) {
    this.preferences = new Preferences(page, context);
    this.article = new Article(page, context);
  }
}
