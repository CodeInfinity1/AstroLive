import type { BirthData } from '../engine/vedic';

export interface InvitePayload {
  name: string;
  date: string;
  time: string;
  place: string;
  gender?: BirthData['gender'];
}

export interface SharedBondPayload {
  a: InvitePayload;
  b: InvitePayload;
}

export function birthToInvite(data: BirthData): InvitePayload {
  return {
    name: data.name,
    date: data.date,
    time: data.time,
    place: data.place,
    gender: data.gender,
  };
}

export function inviteToBirth(data: InvitePayload): BirthData {
  return {
    name: data.name,
    date: data.date,
    time: data.time || '12:00',
    place: data.place,
    gender: data.gender,
  };
}

export function encodePayload(data: unknown): string {
  const json = JSON.stringify(data);
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodePayload<T>(token: string): T | null {
  try {
    let b64 = token.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    const binary = atob(b64);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes)) as T;
  } catch {
    return null;
  }
}

export function buildAppUrl(hashPath: string): string {
  const path = hashPath.startsWith('/') ? hashPath : `/${hashPath}`;
  return `${window.location.origin}${window.location.pathname}#${path}`;
}

export function inviteUrl(payload: InvitePayload): string {
  return buildAppUrl(`/invite/${encodePayload(payload)}`);
}

export function sharedBondUrl(payload: SharedBondPayload): string {
  return buildAppUrl(`/shared/${encodePayload(payload)}`);
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export async function shareOrCopy(title: string, text: string, url?: string): Promise<'shared' | 'copied' | 'failed'> {
  if (navigator.share) {
    try {
      await navigator.share(url ? { title, text, url } : { title, text });
      return 'shared';
    } catch {
      /* cancelled or unsupported — fall through to copy */
    }
  }
  const ok = await copyText(url ? `${text}\n\n${url}` : text);
  return ok ? 'copied' : 'failed';
}
