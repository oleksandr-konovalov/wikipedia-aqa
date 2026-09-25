import { BrowserContext, Locator, Page, expect } from '@playwright/test';

import { Component } from '../abstractClass';
import { Constants } from '@wiki-test-data/constants/constants';
import { logStep } from '@wiki-utils/logStep';

export class Dropdown extends Component {
  private readonly input: Locator;
  private readonly hiddenSelect: Locator;
  private readonly menuItems: Locator;

  public constructor(page: Page, context: BrowserContext, root: Locator) {
    super(page, context);
    this.input = root.locator('input[role="combobox"]');
    this.hiddenSelect = root.locator('select');
    this.menuItems = page.locator('.cdx-menu-item');
  }

  public async expectLoaded(): Promise<void> {
    await expect(this.input, 'Expected lookup input to be visible').toBeVisible();
  }

  @logStep('Choose option in the lookup')
  public async chooseOption(data: { text: string; optionLabel: string }): Promise<void> {
    await this.input.click();
    await this.input.clear();
    await this.input.pressSequentially(data.text, { delay: Constants.TYPING_DELAY });

    const option: Locator = this.menuItems.filter({ hasText: data.optionLabel }).first();

    await expect(option, `Expect option "${data.optionLabel}" to be suggested`).toBeVisible();
    await option.click();
  }

  @logStep('Check the value submitted by the lookup')
  public async expectSelectedValue(value: string): Promise<void> {
    await expect(this.hiddenSelect, `Expect lookup to submit "${value}"`).toHaveValue(value);
  }

  public async getSelectedValue(): Promise<string> {
    return this.hiddenSelect.inputValue();
  }
}
