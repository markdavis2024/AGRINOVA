"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type Role = "FARMER" | "BUYER" | "AGRONOMIST" | "ADMIN";

export type SessionUser = {
  userId: number;
  role: Role;
  name: string;
  email: string;
};

const ROLE_PATH: Record<Role, string> = {
  FARMER: "/farmer",
  BUYER: "/buyer",
  AGRONOMIST: "/agronomist",
  ADMIN: "/admin",
};

export { ROLE_PATH };

/**
 * Loads the current session for a dashboard page. If nobody is
 * signed in, sends them to /login. If someone signed in but with
 * the wrong role for this page, sends them to their own dashboard
 * instead of showing them someone else's.
 */
export function useSession(requiredRole: Role) {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const res = await fetch("/api/auth/me");

        if (res.status === 401) {
          if (!cancelled) router.push("/login");
          return;
        }

        const data = await res.json();
        const sessionUser: SessionUser | undefined = data?.user;

        if (cancelled || !sessionUser) return;

        if (sessionUser.role !== requiredRole) {
          router.push(ROLE_PATH[sessionUser.role] ?? "/login");
          return;
        }

        setUser(sessionUser);
        setLoading(false);
      } catch {
        if (!cancelled) router.push("/login");
      }
    }

    loadSession();

    return () => {
      cancelled = true;
    };
  }, [router, requiredRole]);

  return { user, loading };
}

/**
 * Like useSession, but for pages any signed-in role can visit
 * (e.g. the marketplace). Only redirects to /login if nobody is
 * signed in — never redirects based on role.
 */
export function useAnySession() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const res = await fetch("/api/auth/me");

        if (res.status === 401) {
          if (!cancelled) router.push("/login");
          return;
        }

        const data = await res.json();
        const sessionUser: SessionUser | undefined = data?.user;

        if (cancelled || !sessionUser) return;

        setUser(sessionUser);
        setLoading(false);
      } catch {
        if (!cancelled) router.push("/login");
      }
    }

    loadSession();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return { user, loading };
}
