import type { FeedbackPayload, OrderPayload } from './types';

const API_BASE = (process.env.NEXT_PUBLIC_DEV_URL ?? '').replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(
    public status: number,
    public path: string,
  ) {
    super(`API ${status}: ${path}`);
    this.name = 'ApiError';
  }
}

export function apiUrl(path: string): string {
  if (!API_BASE) throw new Error('NEXT_PUBLIC_DEV_URL is not set');
  return `${API_BASE}/${path.replace(/^\/+/, '')}`;
}

// Some endpoints answer 200 with an empty body when there is nothing to return.
async function readBody<T>(response: Response): Promise<T | null> {
  const text = await response.text();
  return text ? (JSON.parse(text) as T) : null;
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T | null> {
  const response = await fetch(apiUrl(path), {
    cache: 'no-store',
    ...init,
    headers: { Accept: 'application/json', ...init?.headers },
  });
  if (!response.ok) throw new ApiError(response.status, path);
  return readBody<T>(response);
}

async function apiPost<T>(path: string, body: unknown): Promise<{ status: number; data: T | null }> {
  const response = await fetch(apiUrl(path), {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new ApiError(response.status, path);
  return { status: response.status, data: await readBody<T>(response) };
}

export async function fetchPaymentsEnabled(): Promise<boolean> {
  const data = await apiGet<{ payments_enabled: boolean }>('orders/config/');
  return Boolean(data?.payments_enabled);
}

export interface OrderResponse {
  message?: string;
  order_id?: string;
  confirmation_token?: string;
}

export const createOrder = (payload: OrderPayload) => apiPost<OrderResponse>('orders/', payload);

export const sendFeedback = (payload: FeedbackPayload) => apiPost<unknown>('backup/', payload);
