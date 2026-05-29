import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "cavilson_admin";
const MAX_AGE = 60 * 60 * 12; // 12 horas

function secret(): string {
  if (import.meta.env.PROD && !import.meta.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET em falta em produção.");
  }
  return import.meta.env.SESSION_SECRET || "dev-only-change-me-please";
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

export function createSessionToken(): string {
  const expires = Date.now() + MAX_AGE * 1000;
  const payload = `admin:${expires}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = sign(payload);
  try {
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    if (!timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }
  const [, expiresRaw] = payload.split(":");
  const expires = Number(expiresRaw);
  return Number.isFinite(expires) && expires > Date.now();
}

export function checkPassword(input: string): boolean {
  const expected =
    import.meta.env.ADMIN_PASSWORD || (import.meta.env.DEV ? "admin123" : "");
  if (!expected) return false;
  if (input.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(input), Buffer.from(expected));
  } catch {
    return input === expected;
  }
}

export function sessionCookieHeader(token: string): string {
  const secure = import.meta.env.PROD ? "; Secure" : "";
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}${secure}`;
}

export function clearSessionCookieHeader(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function getSessionFromCookie(cookieHeader: string | null): boolean {
  if (!cookieHeader) return false;
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return verifySessionToken(match?.[1]);
}

export { COOKIE_NAME };
