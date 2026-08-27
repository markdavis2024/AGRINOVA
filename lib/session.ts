import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import type { Role } from "@prisma/client";

const COOKIE_NAME = "agrinova_session";
const SESSION_DURATION = "7d";

export type SessionPayload = {
  userId: number;
  role: Role;
  name: string;
  email: string;
};

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error(
      "AUTH_SECRET is not set. Add a long random string to your .env file, e.g. AUTH_SECRET=some-long-random-string"
    );
  }

  return new TextEncoder().encode(secret);
}

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(getSecretKey());

  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/** Maps a role to the dashboard it should land on after login. */
export function dashboardPathForRole(role: Role): string {
  switch (role) {
    case "FARMER":
      return "/farmer";
    case "BUYER":
      return "/buyer";
    case "AGRONOMIST":
      return "/agronomist";
    case "ADMIN":
      return "/admin";
    default:
      return "/login";
  }
}
