import "server-only";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default-secret-key-change-this-in-production");

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

export interface Session {
  user: SessionUser;
  expires: string;
}

export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return null;
    }

    const verified = await jwtVerify(token, secret);
    
    if (!verified.payload.user) {
      return null;
    }

    const user = verified.payload.user as any;
    
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name || null,
        role: user.role,
      },
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
  } catch (error) {
    console.error("Session error:", error);
    return null;
  }
}

export async function createSession(user: SessionUser): Promise<string> {
  const token = await new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(secret);

  return token;
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
}