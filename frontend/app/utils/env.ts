const DEFAULT_BACKEND_URL = 'http://localhost:8000';

type PublicEnvKey =
  | 'NEXT_PUBLIC_SUPABASE_URL'
  | 'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  | 'NEXT_PUBLIC_BACKEND_URL'
  | 'NEXT_PUBLIC_API_URL';

export function getPublicEnv(key: PublicEnvKey): string | undefined {
  const value = process.env[key];
  return value?.trim() || undefined;
}

export function getRequiredPublicEnv(key: PublicEnvKey): string {
  const value = getPublicEnv(key);

  if (!value) {
    throw new Error(`${key} is not configured. Create frontend/.env.local from frontend/.env.example.`);
  }

  return value;
}

export function getBackendBaseUrl(): string {
  const serverUrl = process.env.BACKEND_URL?.trim() || undefined;
  const configuredUrl = serverUrl ?? getPublicEnv('NEXT_PUBLIC_BACKEND_URL') ?? getPublicEnv('NEXT_PUBLIC_API_URL');
  return stripTrailingSlash(configuredUrl ?? DEFAULT_BACKEND_URL);
}

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}
