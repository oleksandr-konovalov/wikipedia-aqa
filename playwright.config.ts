import 'dotenv/config';

import { PlaywrightTestConfig, defineConfig, devices } from '@playwright/test';
import { env, getAuthFilePath } from '@wiki-helpers/base';

import { Constants } from '@wiki-test-data/constants/constants';
import { buildUrls } from '@wiki-helpers/environments';
import fs from 'fs';

buildUrls(env('WIKI_LANG_DOMAIN'));

const authFilePath: string = getAuthFilePath(env('WIKI_USER_NAME'));
const storedSession: string | undefined = fs.existsSync(authFilePath) ? authFilePath : undefined;

const commonUse: PlaywrightTestConfig['use'] = {
  ...devices['Desktop Chrome'],
  storageState: storedSession,
  locale: 'en-US',
  timezoneId: 'Atlantic/Reykjavik',
  viewport: { width: 1920, height: 1080 },
};

export default defineConfig({
  testDir: './playwright/e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }], ['list']],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
    actionTimeout: Constants.THIRTY_SECONDS,
    navigationTimeout: Constants.SIXTY_SECONDS,
  },
  expect: { timeout: Constants.THIRTY_SECONDS },
  timeout: Constants.TWO_MINUTES,
  projects: [
    { name: 'setup', testMatch: /.*auth\.setup\.ts/, use: commonUse },
    {
      name: 'Preferences',
      testDir: './playwright/e2e/preferences',
      use: commonUse,
      dependencies: ['setup'],
    },
  ],
});
