"use client";

import { CheckCircle2, Loader2, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CartItem } from "@/hooks/use-cart";

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
  canSubmit: boolean;
  submitting: boolean;
  onCreateSale: () => void;
  onCreateAndPost: () => void;
}

export function OrderSummary({
  items,
  total,
  canSubmit,
  submitting,
  onCreateSale,
  onCreateAndPost,
}: OrderSummaryProps) {
  const hasItems = items.length > 0;
  const totalQty = items.reduce((a, i) => a + i.quantity, 0);

  return (
    <div className="fixed bottom-0 inset-x-0 z-20 mx-auto w-full max-w-md bg-background/95 backdrop-blur-md border-t border-border/60 shadow-[0_-4px_24px_-8px_rgba(15,23,42,0.08)]">
      <div className="px-4 pt-3 pb-safe-or-4 space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
              <Receipt className="size-3" />
              Итого
            </div>
            <div className="text-[10.5px] text-muted-foreground leading-tight">
              {hasItems
                ? `${items.length} поз. · ${totalQty} шт.`
                : "Товары не добавлены"}
            </div>
          </div>
          <div className="text-[22px] font-bold tracking-tight leading-none text-foreground">
            {total.toLocaleString("ru-RU", { maximumFractionDigits: 2 })}
            <span className="text-muted-foreground text-base ml-0.5">₽</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-10"
            disabled={!canSubmit || submitting}
            onClick={onCreateSale}
          >
            {submitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : null}
            Создать продажу
          </Button>

          <Button
            type="button"
            className="flex-1 h-10"
            disabled={!canSubmit || submitting}
            onClick={onCreateAndPost}
          >
            {submitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <CheckCircle2 className="size-4" />
            )}
            Создать и провести
          </Button>
        </div>
      </div>
    </div>
  );
}
