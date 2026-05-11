"use client";

import { useToken } from "@/components/token-provider";
import { TokenForm } from "./token-form";
import { Skeleton } from "./ui/skeleton";

export function TokenGate({ children }: { children: React.ReactNode }) {
  const { token, ready } = useToken();

  if (!ready) {
    return (
      <div className="flex-1 px-4 py-6 space-y-4">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-10 w-full mt-4" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (!token) {
    return (
      <main className="flex-1 flex flex-col">
        <header className="px-4 py-8 text-center">
          <div className="inline-flex size-14 items-center justify-center rounded-full bg-primary/10 mb-4">
            <span className="text-2xl">🏪</span>
          </div>
          <h1 className="text-xl font-semibold">tablecrm</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Мобильная форма оформления заказа
          </p>
        </header>
        <div className="px-4 pb-8">
          <TokenForm />
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
