"use client";

import Image from "next/image";
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
        <header className="px-5 pt-12 pb-6 text-center">
          <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-primary/10 mb-4">
            <Image src="/logo.svg" alt="TableCRM" width={32} height={32} priority />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">TableCRM</h1>
          <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
            Мобильная форма оформления заказа
          </p>
        </header>
        <div className="px-5 pb-6">
          <div className="rounded-2xl border border-border/70 bg-card p-5 card-soft">
            <TokenForm />
          </div>
        </div>
        <div className="mt-auto px-5 pb-6 text-center">
          <a
            href="https://tablecrm.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            tablecrm.com
          </a>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
