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
import { Label } from "@/components/ui/label";
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
      <div className="flex items-center justify-between">
        <Label>
          Товары
          {items.length > 0 ? (
            <Badge variant="secondary" className="ml-2">
              {items.length}
            </Badge>
          ) : null}
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setShowSearch((v) => !v);
            setTimeout(() => inputRef.current?.focus(), 80);
          }}
        >
          <Search className="size-4 mr-1" />
          Добавить товар
        </Button>
      </div>

      {showSearch ? (
        <div className="rounded-lg border bg-muted/20 p-3 space-y-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              ref={inputRef}
              placeholder="Поиск по названию..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
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
                    "flex items-center justify-between gap-2 rounded-md px-2 py-2 text-sm",
                    inCart ? "bg-primary/5" : "hover:bg-accent",
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{n.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {price > 0 ? `${price.toLocaleString("ru-RU")} ₽` : "Цена не указана"}
                      {n.unit_name ? ` / ${n.unit_name}` : ""}
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant={inCart ? "secondary" : "default"}
                    className="shrink-0 h-7 px-2"
                    onClick={() => handleAdd(n)}
                  >
                    <Plus className="size-3.5 mr-1" />
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
          <Separator />
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
      ) : (
        <div className="flex flex-col items-center gap-1 py-6 text-muted-foreground">
          <ShoppingCart className="size-8 opacity-30" />
          <p className="text-sm">Товары не добавлены</p>
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
    <div className="rounded-lg border bg-background p-3 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium leading-snug flex-1">
          {item.nomenclature.name}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
          onClick={() => onRemove(id)}
          aria-label="Удалить товар"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {/* Количество */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-7"
            onClick={() => onQtyChange(id, item.quantity - 1)}
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
            className="h-7 w-14 text-center text-sm px-1"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-7"
            onClick={() => onQtyChange(id, item.quantity + 1)}
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
            className="h-7 text-sm pr-5"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
            ₽
          </span>
        </div>

        {/* Итого по строке */}
        <div className="text-sm font-medium text-right w-20 shrink-0">
          {lineTotal.toLocaleString("ru-RU", {
            maximumFractionDigits: 2,
          })}{" "}
          ₽
        </div>
      </div>
    </div>
  );
}
