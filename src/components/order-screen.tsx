"use client";

import Image from "next/image";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToken } from "@/components/token-provider";
import { OrderForm } from "@/components/order/order-form";

export function OrderScreen() {
  const { clearToken } = useToken();

  return (
    <main className="flex-1 flex flex-col">
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="inline-flex size-9 items-center justify-center rounded-xl bg-primary/10">
              <Image
                src="/logo.svg"
                alt="TableCRM"
                width={22}
                height={22}
                priority
                className="shrink-0"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-[15px] font-semibold leading-tight tracking-tight">
                Новый заказ
              </h1>
              <p className="text-[11px] text-muted-foreground leading-tight">
                TableCRM · Мобильная форма
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearToken}
            className="text-xs text-muted-foreground gap-1.5 h-8 hover:text-foreground hover:bg-muted"
          >
            <LogOut className="size-3.5" />
            Сменить токен
          </Button>
        </div>
      </header>

      <div className="flex-1 px-4 py-4">
        <OrderForm />
      </div>
    </main>
  );
}
