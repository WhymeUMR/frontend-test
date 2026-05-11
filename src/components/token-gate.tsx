"use client";

import { useToken } from "@/hooks/use-token";
import { TokenForm } from "./token-form";

export function TokenGate({ children }: { children: React.ReactNode }) {
  const { token, ready } = useToken();

  if (!ready) {
    return (
      <div className="flex-1 px-4 py-6">
        <div className="h-6 w-24 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (!token) {
    return (
      <main className="flex-1 px-4 py-6">
        <header className="mb-6">
          <h1 className="text-xl font-semibold">Авторизация</h1>
          <p className="text-sm text-muted-foreground">
            Введите токен кассы tablecrm, чтобы продолжить
          </p>
        </header>
        <TokenForm />
      </main>
    );
  }

  return <>{children}</>;
}
