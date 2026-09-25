import { APIRequestContext, APIResponse } from '@playwright/test';

interface ILoginTokenResponse {
  query: { tokens: { logintoken: string } };
}

interface IClientLoginResponse {
  clientlogin?: { status: string; message?: string; username?: string };
}

const API_PATH: string = '/w/api.php';

export async function getLoginToken(api: APIRequestContext): Promise<string> {
  const response: APIResponse = await api.get(API_PATH, {
    params: { action: 'query', meta: 'tokens', type: 'login', format: 'json' },
  });

  if (!response.ok()) {
    throw Error(`Failed to get a login token: ${response.status()} ${response.statusText()}`);
  }

  const body: ILoginTokenResponse = await response.json();

  return body.query.tokens.logintoken;
}

export async function loginViaApi(api: APIRequestContext, userName: string, password: string): Promise<void> {
  const response: APIResponse = await api.post(API_PATH, {
    form: {
      action: 'clientlogin',
      loginreturnurl: `${process.env.BASE_URL}/`,
      username: userName,
      password,
      logintoken: await getLoginToken(api),
      rememberMe: '1',
      format: 'json',
    },
  });

  const body: IClientLoginResponse = await response.json();

  if (body.clientlogin?.status !== 'PASS') {
    throw Error(
      `Login as "${userName}" failed: ${body.clientlogin?.status} ${body.clientlogin?.message ?? ''}`.trim() +
        '\nCheck WIKI_USER_NAME / WIKI_USER_PASSWORD in .env.',
    );
  }
}
