import { Locator, expect } from '@playwright/test';

import { AppPage } from '../abstractClass';
import { Button } from '@wiki-components/button.component';
import { Constants } from '@wiki-test-data/constants/constants';
import { Dropdown } from '@wiki-components/dropdown.component';
import { ILanguage } from '@wiki-types/enums/language';
import { Notification } from '@wiki-components/notification.component';
import { env } from '@wiki-helpers/base';
import { logStep } from '@wiki-utils/logStep';

export class Preferences extends AppPage {
  public pagePath: string = `${env('PREFERENCES_URL')}${Constants.PREFERENCES_PERSONAL_SECTION}`;

  public interfaceLanguageDropdown: Dropdown = new Dropdown(
    this.page,
    this.context,
    this.page.locator(Constants.PREFERENCES_LANGUAGE_FIELD),
  );
  public saveButton: Button = new Button(
    this.page,
    this.context,
    this.page.locator('#prefcontrol button[type="submit"]'),
  );
  public savedNotification: Notification = new Notification(
    this.page,
    this.context,
    this.page.locator('.mw-notification'),
  );

  private title: Locator = this.page.locator('#firstHeading');
  private userProfileTab: Locator = this.page.locator(`[href="${Constants.PREFERENCES_PERSONAL_SECTION}"]`).first();
  private userProfileTabPanel: Locator = this.page.locator(Constants.PREFERENCES_PERSONAL_SECTION);
  private internationalisationSection: Locator = this.page
    .locator(Constants.PREFERENCES_I18N_SUBSECTION)
    .or(this.page.locator('fieldset:has(#mw-input-wplanguage)'))
    .first();

  public async expectLoaded(): Promise<void> {
    await expect(this.title, 'Expected Preferences page to be visible').toBeVisible({
      timeout: Constants.THIRTY_SECONDS,
    });
  }

  @logStep('Open "User profile" tab')
  public async openUserProfileTab(): Promise<void> {
    if (await this.userProfileTab.isVisible()) {
      await this.userProfileTab.click();
    }

    await expect(this.userProfileTabPanel, 'Expected "User profile" tab to be opened').toBeVisible();
  }

  @logStep('Check "Internationalisation" section is shown')
  public async expectInternationalisationSectionLoaded(): Promise<void> {
    await this.internationalisationSection.scrollIntoViewIfNeeded();
    await expect(
      this.internationalisationSection,
      'Expected "Internationalisation" section to be visible',
    ).toBeVisible();
    await this.interfaceLanguageDropdown.expectLoaded();
  }

  @logStep('Select interface language')
  public async selectInterfaceLanguage(language: ILanguage): Promise<void> {
    await this.interfaceLanguageDropdown.chooseOption({
      text: language.nativeName,
      optionLabel: `${language.code}${Constants.LANGUAGE_OPTION_SEPARATOR}${language.nativeName}`,
    });
    await this.interfaceLanguageDropdown.expectSelectedValue(language.code);
  }

  @logStep('Save preferences')
  public async save(): Promise<void> {
    await this.saveButton.click();
    await this.savedNotification.expectLoaded();
  }

  @logStep('Change interface language and save preferences')
  public async changeInterfaceLanguage(language: ILanguage): Promise<void> {
    await this.openUserProfileTab();
    await this.expectInternationalisationSectionLoaded();
    await this.selectInterfaceLanguage(language);
    await this.save();
  }

  @logStep('Check Preferences page is rendered in the selected language')
  public async expectRenderedInLanguage(language: ILanguage): Promise<void> {
    await this.expectInterfaceLanguageCode(language.code);
    await expect(this.title, `Expect Preferences title to be "${language.preferencesTitle}"`).toHaveText(
      language.preferencesTitle,
    );
  }

  public async getSelectedInterfaceLanguage(): Promise<string> {
    return this.interfaceLanguageDropdown.getSelectedValue();
  }
}
