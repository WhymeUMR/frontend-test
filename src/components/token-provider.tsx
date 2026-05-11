"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { clearToken, getToken, setToken } from "@/lib/token";

interface TokenContextValue {
  token: string | null;
  ready: boolean;
  setToken: (value: string) => void;
  clearToken: () => void;
}

const TokenContext = createContext<TokenContextValue | null>(null);

export function TokenProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTokenState(getToken());
    setReady(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key === "tablecrm.token") {
        setTokenState(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const save = useCallback((value: string) => {
    setToken(value);
    setTokenState(value.trim());
  }, []);

  const reset = useCallback(() => {
    clearToken();
    setTokenState(null);
  }, []);

  return (
    <TokenContext.Provider value={{ token, ready, setToken: save, clearToken: reset }}>
      {children}
    </TokenContext.Provider>
  );
}

export function useToken() {
  const ctx = useContext(TokenContext);
  if (!ctx) throw new Error("useToken must be used inside TokenProvider");
  return ctx;
}
