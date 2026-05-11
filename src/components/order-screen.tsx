"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToken } from "@/components/token-provider";
import { OrderForm } from "@/components/order/order-form";

export function OrderScreen() {
  const { clearToken } = useToken();

  return (
    <main className="flex-1 flex flex-col">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b px-4 py-3 flex items-center justify-between gap-2">
        <div>
          <h1 className="text-base font-semibold leading-tight">Новый заказ</h1>
          <p className="text-xs text-muted-foreground">tablecrm</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={clearToken}
          className="text-xs text-muted-foreground gap-1.5"
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
