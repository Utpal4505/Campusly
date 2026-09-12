"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authClient, UserProfile, UserSession } from "@/lib/auth";
import { useCampusStore } from "@/lib/store";

interface AuthContextType {
  user: UserProfile | null;
  session: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  signOut: async () => {},
  refresh: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { setUserName, setSelectedInterests } = useCampusStore();

  const [session, setSession] = useState<UserSession | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAuth = useCallback(async () => {
    try {
      const activeSession = await authClient.getSession();
      setSession(activeSession);

      if (activeSession?.user) {
        const profile = await authClient.getMe().catch(() => null);
        setUser(profile);
        if (profile?.name) {
          setUserName(profile.name);
        }
        if (profile?.interests && profile.interests.length > 0) {
          setSelectedInterests(profile.interests);
        }
      } else {
        setUser(null);
      }
    } catch {
      setSession(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [setUserName, setSelectedInterests]);

  useEffect(() => {
    fetchAuth();

    const handlePrefUpdate = () => {
      fetchAuth();
    };

    window.addEventListener("campusly:preferences-updated", handlePrefUpdate);
    return () => {
      window.removeEventListener("campusly:preferences-updated", handlePrefUpdate);
    };
  }, [fetchAuth]);

  const signOut = async () => {
    try {
      await authClient.signOut();
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      setSession(null);
      setUser(null);
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: Boolean(session?.user),
        isLoading,
        signOut,
        refresh: fetchAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
