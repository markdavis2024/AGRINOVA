"use client";

import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  region?: string;
  iotInterest?: boolean;
}

export const ROLE_PATH = {
  FARMER: "/farmer",
  BUYER: "/buyer",
  ADMIN: "/admin",
  AGRONOMIST: "/agronomist",
};

export function useSession(requiredRole?: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          if (data.session?.user) {
            setUser(data.session.user);
          } else {
            // Fallback mock user
            setUser({
              id: "1",
              name: "John Farmer",
              email: "farmer@agrinova.cm",
              role: "FARMER",
              region: "Centre",
              iotInterest: true,
            });
          }
        } else {
          // Fallback mock user
          setUser({
            id: "1",
            name: "John Farmer",
            email: "farmer@agrinova.cm",
            role: "FARMER",
            region: "Centre",
            iotInterest: true,
          });
        }
      } catch (error) {
        console.error("Session error:", error);
        setUser({
          id: "1",
          name: "John Farmer",
          email: "farmer@agrinova.cm",
          role: "FARMER",
          region: "Centre",
          iotInterest: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  return { user, loading };
}

// For pages that accept any role (marketplace, etc.)
export function useAnySession() {
  return useSession();
}