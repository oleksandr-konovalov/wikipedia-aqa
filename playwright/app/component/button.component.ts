import { BrowserContext, Locator, Page, expect } from '@playwright/test';

import { ActionOptions } from '@wiki-types/actionOptions';
import { Component } from '../abstractClass';
import { logStep } from '@wiki-utils/logStep';

export class Button extends Component {
  private readonly button: Locator;

  public constructor(page: Page, context: BrowserContext, button: Locator) {
    super(page, context);
    this.button = button;
  }

  public async expectLoaded(): Promise<void> {
    await expect(this.button, 'Expected button to be visible').toBeVisible();
  }

  @logStep('Click button')
  public async click(options: ActionOptions = {}): Promise<void> {
    const { index = 0, timeout, force } = options;

    await this.button.nth(index).click({ timeout, force });
  }
}
