const urlTemplates: { [key: string]: string } = {
  BASE_URL: 'https://{langDomain}.wikipedia.org',
  PREFERENCES_URL: 'https://{langDomain}.wikipedia.org/wiki/Special:Preferences',
};

export function buildUrls(langDomain: string = process.env.WIKI_LANG_DOMAIN ?? 'en'): void {
  Object.keys(urlTemplates).forEach((key: string) => {
    process.env[key] = urlTemplates[key].replace('{langDomain}', langDomain);
  });
}
