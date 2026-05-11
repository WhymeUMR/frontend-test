"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, Loader2, X } from "lucide-react";

import { api } from "@/lib/api";
import type { Contragent } from "@/lib/api-types";
import { cn } from "@/lib/utils";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContragentFieldProps {
  token: string;
  value: Contragent | null;
  onChange: (value: Contragent | null) => void;
}

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").replace(/^8/, "7");
  if (!digits) return "";
  const d = digits.slice(0, 11);
  const parts = [
    d.slice(0, 1),
    d.slice(1, 4),
    d.slice(4, 7),
    d.slice(7, 9),
    d.slice(9, 11),
  ].filter(Boolean);
  let res = "+" + parts[0];
  if (parts[1]) res += " (" + parts[1];
  if (parts[1] && parts[1].length === 3) res += ")";
  if (parts[2]) res += " " + parts[2];
  if (parts[3]) res += "-" + parts[3];
  if (parts[4]) res += "-" + parts[4];
  return res;
}

export function ContragentField({ token, value, onChange }: ContragentFieldProps) {
  const [phone, setPhone] = useState(value?.phone ? formatPhone(value.phone) : "");
  const [focused, setFocused] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const debouncedPhone = useDebouncedValue(phone, 350);

  useEffect(() => {
    // Если пользователь начал менять телефон — сбрасываем выбранного клиента.
    if (value && formatPhone(value.phone ?? "") !== phone) onChange(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phone]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const digits = useMemo(() => debouncedPhone.replace(/\D/g, ""), [debouncedPhone]);
  const enabled = digits.length >= 4 && !value;

  const { data, isFetching } = useQuery({
    queryKey: ["contragents", "search", digits],
    queryFn: ({ signal }) =>
      api.contragents(token, { phone: digits, limit: 20 }, signal),
    enabled,
    staleTime: 30_000,
  });

  const handleSelect = (c: Contragent) => {
    onChange(c);
    if (c.phone) setPhone(formatPhone(c.phone));
    setFocused(false);
  };

  const handleClear = () => {
    onChange(null);
    setPhone("");
  };

  const showResults = focused && enabled && (data?.length ?? 0) > 0;

  return (
    <div className="space-y-2" ref={wrapRef}>
      <Label htmlFor="phone">Телефон клиента</Label>
      <div className="relative">
        <Input
          id="phone"
          type="tel"
          inputMode="tel"
          autoComplete="off"
          placeholder="+7 (___) ___-__-__"
          value={phone}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
          onFocus={() => setFocused(true)}
          className="pr-9"
        />
        <div className="absolute inset-y-0 right-2 flex items-center text-muted-foreground">
          {isFetching ? (
            <Loader2 className="size-4 animate-spin" />
          ) : value || phone ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-6"
              onClick={handleClear}
              aria-label="Очистить"
            >
              <X className="size-4" />
            </Button>
          ) : null}
        </div>

        {showResults ? (
          <div className="absolute left-0 right-0 top-full mt-1 z-30 rounded-md border bg-popover shadow-md">
            <ul className="max-h-64 overflow-auto p-1">
              {(data ?? []).map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(c)}
                    className={cn(
                      "w-full text-left rounded-md px-2 py-2 text-sm hover:bg-accent flex items-start gap-2",
                    )}
                  >
                    <Check
                      className={cn(
                        "mt-0.5 size-4 shrink-0",
                        value && (value as Contragent).id === c.id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    <div className="min-w-0">
                      <div className="font-medium truncate">
                        {c.name || "Без имени"}
                      </div>
                      {c.phone ? (
                        <div className="text-xs text-muted-foreground">
                          {formatPhone(c.phone)}
                        </div>
                      ) : null}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {value ? (
        <p className="text-xs text-muted-foreground">
          Выбран клиент: <span className="text-foreground">{value.name}</span>
        </p>
      ) : digits.length > 0 && digits.length < 4 ? (
        <p className="text-xs text-muted-foreground">
          Введите минимум 4 цифры для поиска
        </p>
      ) : enabled && !isFetching && (data?.length ?? 0) === 0 ? (
        <p className="text-xs text-muted-foreground">
          Клиент не найден — продажа будет без клиента
        </p>
      ) : null}
    </div>
  );
}
