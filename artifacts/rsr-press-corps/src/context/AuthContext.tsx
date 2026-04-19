import React, { createContext, useContext, useState, ReactNode } from "react";
import { useGetMe } from "@workspace/api-client-react";
import type { AuthUser } from "@workspace/api-client-react/src/generated/api.schemas";

const ADMIN_STORAGE_KEY = "rsr_admin_unlocked";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  role: string | null;
  refetch: () => void;
  adminUnlocked: boolean;
  setAdminUnlocked: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [adminUnlocked, setAdminUnlockedState] = useState<boolean>(() => {
    try { return localStorage.getItem(ADMIN_STORAGE_KEY) === "1"; } catch { return false; }
  });

  const { data: serverUser, isLoading: serverLoading, refetch } = useGetMe({
    query: {
      retry: false,
      enabled: !adminUnlocked,
    },
  });

  function setAdminUnlocked(v: boolean) {
    try {
      if (v) localStorage.setItem(ADMIN_STORAGE_KEY, "1");
      else localStorage.removeItem(ADMIN_STORAGE_KEY);
    } catch { /* noop */ }
    setAdminUnlockedState(v);
  }

  const adminUser: AuthUser = {
    id: 0,
    email: "command@rsrpresscorps.internal",
    name: "Command",
    role: "operator",
    tier: "command",
  };

  const user = adminUnlocked ? adminUser : (serverUser ?? null);
  const isLoading = adminUnlocked ? false : serverLoading;
  const role = user?.role ?? null;

  return (
    <AuthContext.Provider value={{ user, isLoading, role, refetch, adminUnlocked, setAdminUnlocked }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
