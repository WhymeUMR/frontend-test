"use client";

import { Button } from "@/components/ui/button";
import { useToken } from "@/hooks/use-token";
import { OrderForm } from "@/components/order/order-form";

export function OrderScreen() {
  const { clearToken } = useToken();

  return (
    <main className="flex-1 px-4 py-6">
      <header className="mb-6 flex items-start justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold">Новый заказ</h1>
          <p className="text-sm text-muted-foreground">
            Мобильная форма оформления продажи
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={clearToken}
          className="text-xs text-muted-foreground"
        >
          Сменить токен
        </Button>
      </header>

      <OrderForm />
    </main>
  );
}
