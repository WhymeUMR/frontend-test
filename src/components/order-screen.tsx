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
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/60 px-4 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="TableCRM"
            width={22}
            height={22}
            priority
            className="shrink-0"
          />
          <div>
            <h1 className="text-sm font-semibold leading-tight">
              Новый заказ
            </h1>
            <p className="text-[11px] text-muted-foreground leading-tight">
              TableCRM
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={clearToken}
          className="text-xs text-muted-foreground gap-1.5 hover:text-primary"
        >
          <LogOut className="size-3.5" />
          Сменить токен
        </Button>
      </header>

      <div className="flex-1 px-4 py-5">
        <OrderForm />
      </div>
    </main>
  );
}
