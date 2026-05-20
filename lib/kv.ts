// Vercel KV / Upstash Redis 자동 감지.
// 환경변수가 없으면 null 반환 → 클라이언트는 localStorage 사용.
import { createClient, VercelKV } from "@vercel/kv";

const KV_KEY = "sloboda-seo:state:v1";

let cached: VercelKV | null | undefined;

function getClient(): VercelKV | null {
  if (cached !== undefined) return cached;
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    cached = null;
    return null;
  }
  try {
    cached = createClient({ url, token });
    return cached;
  } catch {
    cached = null;
    return null;
  }
}

export async function kvGet<T = unknown>(): Promise<T | null> {
  const client = getClient();
  if (!client) return null;
  try {
    const v = await client.get<T>(KV_KEY);
    return v ?? null;
  } catch {
    return null;
  }
}

export async function kvSet<T = unknown>(value: T): Promise<boolean> {
  const client = getClient();
  if (!client) return false;
  try {
    await client.set(KV_KEY, value);
    return true;
  } catch {
    return false;
  }
}

export function kvConnected(): boolean {
  return getClient() !== null;
}
