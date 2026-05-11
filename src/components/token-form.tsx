"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToken } from "@/hooks/use-token";

export function TokenForm() {
  const { setToken } = useToken();
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    setToken(trimmed);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="space-y-2">
        <Label htmlFor="token">Токен кассы</Label>
        <div className="relative">
          <Input
            id="token"
            type={show ? "text" : "password"}
            autoComplete="off"
            spellCheck={false}
            placeholder="Введите токен..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 size-7 text-muted-foreground"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Скрыть токен" : "Показать токен"}
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Токен сохраняется только в этом браузере (localStorage).
        </p>
      </div>
      <Button type="submit" disabled={!value.trim()}>
        Войти
      </Button>
    </form>
  );
}
