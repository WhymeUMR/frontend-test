"use client";

import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Minus, Plus, Search, ShoppingCart, Trash2 } from "lucide-react";

import { api } from "@/lib/api";
import type { Nomenclature } from "@/lib/api-types";
import { cn } from "@/lib/utils";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { resolvePrice, type CartItem } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface NomenclaturePickerProps {
  token: string;
  priceTypeId?: number | null;
  items: CartItem[];
  onAdd: (n: Nomenclature, priceTypeId?: number | null) => void;
  onRemove: (id: number) => void;
  onQtyChange: (id: number, qty: number) => void;
  onPriceChange: (id: number, price: number) => void;
}

export function NomenclaturePicker({
  token,
  priceTypeId,
  items,
  onAdd,
  onRemove,
  onQtyChange,
  onPriceChange,
}: NomenclaturePickerProps) {
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedSearch = useDebouncedValue(search, 350);

  const { data, isFetching } = useQuery({
    queryKey: ["nomenclature", "search", debouncedSearch, token],
    queryFn: ({ signal }) =>
      api.nomenclature(
        token,
        { name: debouncedSearch || undefined, limit: 20, with_prices: true },
        signal,
      ),
    enabled: showSearch,
    staleTime: 30_000,
  });

  const cartIds = new Set(items.map((i) => i.nomenclature.id));

  const handleAdd = (n: Nomenclature) => {
    onAdd(n, priceTypeId);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="text-[12px] font-medium text-muted-foreground">
          {items.length > 0 ? (
            <span className="inline-flex items-center gap-1.5">
              <span>Добавлено</span>
              <Badge variant="secondary" className="px-1.5 py-0">
                {items.length}
              </Badge>
            </span>
          ) : (
            "Номенклатура"
          )}
        </div>
        <Button
          type="button"
          variant={showSearch ? "secondary" : "default"}
          size="sm"
          className="h-8"
          onClick={() => {
            setShowSearch((v) => !v);
            setTimeout(() => inputRef.current?.focus(), 80);
          }}
        >
          <Search className="size-3.5" />
          {showSearch ? "Скрыть" : "Добавить"}
        </Button>
      </div>

      {showSearch ? (
        <div className="rounded-xl border border-border/60 bg-muted/30 p-2.5 space-y-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              ref={inputRef}
              placeholder="Поиск по названию…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-9 bg-background"
            />
            {isFetching ? (
              <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 animate-spin text-muted-foreground" />
            ) : null}
          </div>

          <ul className="space-y-1 max-h-64 overflow-auto">
            {(data ?? []).map((n) => {
              const inCart = cartIds.has(n.id);
              const price = resolvePrice(n, priceTypeId);
              return (
                <li
                  key={n.id}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-lg px-2 py-2 text-sm transition-colors",
                    inCart ? "bg-primary/8" : "bg-background hover:bg-accent",
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate text-[13px]">{n.name}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {price > 0 ? (
                        <span className="text-foreground/80 font-medium">
                          {price.toLocaleString("ru-RU")} ₽
                        </span>
                      ) : (
                        "Цена не указана"
                      )}
                      {n.unit_name ? (
                        <span className="text-muted-foreground"> / {n.unit_name}</span>
                      ) : null}
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant={inCart ? "secondary" : "default"}
                    className="shrink-0 h-8 px-2.5"
                    onClick={() => handleAdd(n)}
                  >
                    <Plus className="size-3.5" />
                    {inCart ? "Ещё" : "Добавить"}
                  </Button>
                </li>
              );
            })}
            {!isFetching && (data?.length ?? 0) === 0 ? (
              <li className="text-sm text-muted-foreground text-center py-4">
                {search ? "Ничего не найдено" : "Начните вводить название товара"}
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}

      {items.length > 0 ? (
        <>
          {showSearch ? <Separator /> : null}
          <div className="space-y-2">
            {items.map((item) => (
              <CartRow
                key={item.nomenclature.id}
                item={item}
                onQtyChange={onQtyChange}
                onPriceChange={onPriceChange}
                onRemove={onRemove}
              />
            ))}
          </div>
        </>
      ) : showSearch ? null : (
        <div className="flex flex-col items-center gap-1.5 py-6 rounded-xl border border-dashed border-border/70 bg-muted/20 text-muted-foreground">
          <ShoppingCart className="size-7 opacity-40" />
          <p className="text-[12.5px]">Товары не добавлены</p>
          <p className="text-[11px] text-muted-foreground/80">Нажмите «Добавить» выше</p>
        </div>
      )}
    </div>
  );
}

interface CartRowProps {
  item: CartItem;
  onQtyChange: (id: number, qty: number) => void;
  onPriceChange: (id: number, price: number) => void;
  onRemove: (id: number) => void;
}

function CartRow({ item, onQtyChange, onPriceChange, onRemove }: CartRowProps) {
  const id = item.nomenclature.id;
  const lineTotal = item.price * item.quantity;

  return (
    <div className="rounded-xl border border-border/70 bg-background p-3 space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-medium leading-snug">
            {item.nomenclature.name}
          </div>
          {item.nomenclature.unit_name ? (
            <div className="text-[10.5px] text-muted-foreground mt-0.5">
              {item.nomenclature.unit_name}
            </div>
          ) : null}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[15px] font-semibold tabular-nums">
            {lineTotal.toLocaleString("ru-RU", { maximumFractionDigits: 2 })}
            <span className="text-muted-foreground text-[12px] ml-0.5">₽</span>
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7 text-muted-foreground hover:text-destructive"
            onClick={() => onRemove(id)}
            aria-label="Удалить товар"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Количество */}
        <div className="inline-flex items-center rounded-lg border border-border bg-muted/30 p-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7 hover:bg-background"
            onClick={() => onQtyChange(id, item.quantity - 1)}
            aria-label="Уменьшить"
          >
            <Minus className="size-3" />
          </Button>
          <Input
            type="number"
            inputMode="decimal"
            min="0.01"
            step="any"
            value={item.quantity}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              if (!isNaN(v) && v > 0) onQtyChange(id, v);
            }}
            className="h-7 w-12 text-center text-[12.5px] px-1 border-0 shadow-none bg-transparent focus-visible:ring-0"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-7 hover:bg-background"
            onClick={() => onQtyChange(id, item.quantity + 1)}
            aria-label="Увеличить"
          >
            <Plus className="size-3" />
          </Button>
        </div>

        <span className="text-muted-foreground text-xs">×</span>

        {/* Цена */}
        <div className="relative flex-1">
          <Input
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            value={item.price}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              if (!isNaN(v) && v >= 0) onPriceChange(id, v);
            }}
            className="h-8 text-[12.5px] pr-6 bg-background"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground pointer-events-none">
            ₽
          </span>
        </div>
      </div>
    </div>
  );
}
