import { EnvVars } from '@wiki-types/envVars';

export function env(key: EnvVars): string {
  const value: string | undefined = process.env[key];

  if (!value) {
    throw Error(`No environment variable found for ${key}. Check your .env file (see .env.example).`);
  }

  return value;
}

export function getAuthFilePath(userName: string): string {
  return `playwright/.auth/${userName.replace(/[^\w.-]/g, '_')}.json`;
}
