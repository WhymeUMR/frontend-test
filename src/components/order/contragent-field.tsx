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

// Префикс "+7" всегда фиксирован, пользователь редактирует только 10 цифр после.
function formatPhone(raw: string): string {
  // Убираем всё кроме цифр; первая 7/8 — это код страны, отбрасываем её,
  // чтобы оставить только 10 цифр номера.
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("7") || digits.startsWith("8")) digits = digits.slice(1);
  digits = digits.slice(0, 10);

  let res = "+7";
  if (digits.length > 0) res += " (" + digits.slice(0, 3);
  if (digits.length >= 3) res += ")";
  if (digits.length > 3) res += " " + digits.slice(3, 6);
  if (digits.length > 6) res += "-" + digits.slice(6, 8);
  if (digits.length > 8) res += "-" + digits.slice(8, 10);
  return res;
}

const EMPTY_PHONE = "+7";
const PHONE_PLACEHOLDER = "+7 (___) ___-__-__";

export function ContragentField({ token, value, onChange }: ContragentFieldProps) {
  const [phone, setPhone] = useState(
    value?.phone ? formatPhone(value.phone) : "",
  );
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
  // Локальные цифры — без префикса "7".
  const localDigits = useMemo(
    () => (digits.startsWith("7") ? digits.slice(1) : digits),
    [digits],
  );
  const enabled = localDigits.length >= 3 && !value;

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
    setPhone(focused ? EMPTY_PHONE : "");
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
          placeholder={PHONE_PLACEHOLDER}
          value={phone}
          onChange={(e) => setPhone(formatPhone(e.target.value))}
          onFocus={() => {
            setFocused(true);
            // При фокусе на пустое поле — подставляем "+7", чтобы префикс был зафиксирован.
            if (!phone) setPhone(EMPTY_PHONE);
          }}
          onBlur={() => {
            // Если пользователь не ввёл ни одной цифры — возвращаем placeholder.
            if (phone === EMPTY_PHONE) setPhone("");
          }}
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
      ) : localDigits.length > 0 && localDigits.length < 3 ? (
        <p className="text-xs text-muted-foreground">
          Введите минимум 3 цифры для поиска
        </p>
      ) : enabled && !isFetching && (data?.length ?? 0) === 0 ? (
        <p className="text-xs text-muted-foreground">
          Клиент не найден — продажа будет без клиента
        </p>
      ) : null}
    </div>
  );
}
