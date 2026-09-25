import { BrowserContext, Locator, Page, expect } from '@playwright/test';

import { Component } from '../abstractClass';
import { Constants } from '@wiki-test-data/constants/constants';
import { logStep } from '@wiki-utils/logStep';

export class Notification extends Component {
  private readonly notification: Locator;

  public constructor(page: Page, context: BrowserContext, notification: Locator) {
    super(page, context);
    this.notification = notification;
  }

  @logStep('Check notification is shown')
  public async expectLoaded(): Promise<void> {
    await expect(this.notification.first(), 'Expected notification to be visible').toBeVisible({
      timeout: Constants.THIRTY_SECONDS,
    });
  }
}
