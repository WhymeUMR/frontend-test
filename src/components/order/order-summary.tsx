"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
  return (
    <div className="fixed bottom-0 inset-x-0 z-20 mx-auto w-full max-w-md bg-background border-t shadow-lg">
      <div className="px-4 pt-3 pb-safe-or-3 space-y-3">
        {items.length > 0 ? (
          <>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Товаров: {items.length} поз. /{" "}
                {items.reduce((a, i) => a + i.quantity, 0)} шт.
              </span>
              <span className="font-semibold text-base">
                {total.toLocaleString("ru-RU", { maximumFractionDigits: 2 })} ₽
              </span>
            </div>
            <Separator />
          </>
        ) : null}

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            disabled={!canSubmit || submitting}
            onClick={onCreateSale}
          >
            {submitting ? (
              <Loader2 className="size-4 animate-spin mr-2" />
            ) : null}
            Создать продажу
          </Button>

          <Button
            type="button"
            className="flex-1"
            disabled={!canSubmit || submitting}
            onClick={onCreateAndPost}
          >
            {submitting ? (
              <Loader2 className="size-4 animate-spin mr-2" />
            ) : null}
            Создать и провести
          </Button>
        </div>
      </div>
    </div>
  );
}
