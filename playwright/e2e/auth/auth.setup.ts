import { APIRequestContext, test as setup } from '@playwright/test';
import { env, getAuthFilePath } from '@wiki-helpers/base';

import { Constants } from '@wiki-test-data/constants/constants';
import { loginViaApi } from '@wiki-helpers/auth.helper';

setup('authenticate as Wikipedia user', { tag: '@auth' }, async ({ playwright }): Promise<void> => {
  // The login form is protected by hCaptcha, so the session is created through the MediaWiki
  // `clientlogin` API - the same flow the form itself uses, which returns a regular web session.
  const api: APIRequestContext = await playwright.request.newContext({
    baseURL: env('BASE_URL'),
    extraHTTPHeaders: { 'User-Agent': Constants.USER_AGENT },
  });

  await loginViaApi(api, env('WIKI_USER_NAME'), env('WIKI_USER_PASSWORD'));

  await setup.step(`🍪Storing authorized session in ${getAuthFilePath(env('WIKI_USER_NAME'))}🍪`, async () => {
    await api.storageState({ path: getAuthFilePath(env('WIKI_USER_NAME')) });
  });

  await api.dispose();
});
