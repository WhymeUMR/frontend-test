"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";
import { clearToken as clearStoredToken, getToken, setToken as setStoredToken } from "@/lib/token";

interface TokenContextValue {
  token: string | null;
  ready: boolean;
  setToken: (value: string) => void;
  clearToken: () => void;
}

const TokenContext = createContext<TokenContextValue | null>(null);

// localStorage — внешний источник состояния, поэтому используем useSyncExternalStore.
// Это решает SSR-гидрацию без setState внутри useEffect.
const TOKEN_STORAGE_KEY = "tablecrm.token";

function subscribeToken(callback: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === TOKEN_STORAGE_KEY) callback();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener("tablecrm:token-change", callback);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("tablecrm:token-change", callback);
  };
}

function getTokenSnapshot(): string | null {
  return getToken();
}

function getServerTokenSnapshot(): string | null {
  return null;
}

function subscribeNoop() {
  return () => {};
}

function getReadyClient(): boolean {
  return true;
}

function getReadyServer(): boolean {
  return false;
}

export function TokenProvider({ children }: { children: React.ReactNode }) {
  const token = useSyncExternalStore(
    subscribeToken,
    getTokenSnapshot,
    getServerTokenSnapshot,
  );
  // ready переходит в true после первой клиентской re-render — после гидрации.
  const ready = useSyncExternalStore(
    subscribeNoop,
    getReadyClient,
    getReadyServer,
  );

  const save = useCallback((value: string) => {
    setStoredToken(value);
    window.dispatchEvent(new Event("tablecrm:token-change"));
  }, []);

  const reset = useCallback(() => {
    clearStoredToken();
    window.dispatchEvent(new Event("tablecrm:token-change"));
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
