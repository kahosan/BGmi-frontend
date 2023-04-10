import type { SaveFilterBody } from '~/types/subscribe';

export const fetcher = async <T>([key, authToken]: [string, string?], options: ResponseInit): Promise<T> => {
  const headers = new Headers();
  if (authToken) headers.append('authorization', `Bearer ${authToken}`);

  // request timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 10000);

  const res = await fetch(`.${key}`, { signal: controller.signal, headers, ...options });

  if (!res.ok) throw await res.json();

  clearTimeout(timeoutId);
  return res.json();
};

interface FetcherExtraArg {
  body?: SaveFilterBody | { bangumi: string; episode?: number };
  method?: string;
}

export const fetcherWithMutation = async <T>(
  [key, authToken]: [string, string?],
  { arg }: { arg: FetcherExtraArg }
): Promise<T> => {
  const headers = new Headers({ 'Content-Type': 'application/json' });
  if (authToken) headers.append('authorization', `Bearer ${authToken}`);

  const options: RequestInit = {
    headers,
    method: arg.method ?? 'POST',
    body: JSON.stringify(arg.body),
  };

  // request timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 15000);

  const res = await fetch(`.${key}`, { signal: controller.signal, ...options });

  if (!res.ok) throw await res.json();

  clearTimeout(timeoutId);
  return res.json();
};
