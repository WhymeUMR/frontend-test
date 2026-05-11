"use client";

import { useCallback, useEffect, useState } from "react";
import { clearToken, getToken, setToken } from "@/lib/token";

export function useToken() {
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

  return { token, ready, setToken: save, clearToken: reset };
}
