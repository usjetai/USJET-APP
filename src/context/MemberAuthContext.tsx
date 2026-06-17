import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { resetProtocolSession } from "../lib/protocolCeremony";
import { clearMemberSession, readMemberSession, writeMemberSession } from "../lib/memberSession";
import { verifyMemberAccess } from "../lib/verifyMember";
import type { MemberSession } from "../types/member";

type MemberAuthContextValue = {
  session: MemberSession | null;
  loading: boolean;
  error: string | null;
  login: (memberId: string, email?: string) => Promise<boolean>;
  logout: () => void;
  refresh: () => Promise<void>;
};

const MemberAuthContext = createContext<MemberAuthContextValue | null>(null);

export function MemberAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<MemberSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const applySession = useCallback((next: MemberSession | null) => {
    setSession(next);
    if (next?.active) {
      writeMemberSession(next);
    } else {
      clearMemberSession();
    }
  }, []);

  const refresh = useCallback(async () => {
    const cached = readMemberSession();
    if (!cached) {
      applySession(null);
      return;
    }

    try {
      const verified = await verifyMemberAccess({
        memberId: cached.customerId,
        email: cached.email,
      });

      if (!verified.active) {
        applySession(null);
        return;
      }

      applySession(verified);
    } catch {
      applySession(cached.active ? cached : null);
    }
  }, [applySession]);

  useEffect(() => {
    const bootstrap = async () => {
      setLoading(true);
      const cached = readMemberSession();
      if (!cached) {
        setSession(null);
        setLoading(false);
        return;
      }

      setSession(cached);
      await refresh();
      setLoading(false);
    };

    void bootstrap();
  }, [refresh]);

  const login = useCallback(
    async (memberId: string, email?: string) => {
      setError(null);
      setLoading(true);

      try {
        const verified = await verifyMemberAccess({ memberId, email });
        if (!verified.active) {
          setError("No active USJET subscription found. Pay via Stripe first, then log in with your access sentence.");
          applySession(null);
          return false;
        }

        applySession(verified);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Login failed.");
        applySession(null);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [applySession],
  );

  const logout = useCallback(() => {
    clearMemberSession();
    resetProtocolSession();
    setSession(null);
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      loading,
      error,
      login,
      logout,
      refresh,
    }),
    [session, loading, error, login, logout, refresh],
  );

  return <MemberAuthContext.Provider value={value}>{children}</MemberAuthContext.Provider>;
}

export function useMemberAuth(): MemberAuthContextValue {
  const context = useContext(MemberAuthContext);
  if (!context) {
    throw new Error("useMemberAuth must be used within MemberAuthProvider");
  }
  return context;
}
