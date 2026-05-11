"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToken } from "@/components/token-provider";

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
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="space-y-2">
        <Label htmlFor="token" className="text-sm font-medium">
          Токен кассы
        </Label>
        <div className="relative">
          <Input
            id="token"
            type={show ? "text" : "password"}
            autoComplete="off"
            spellCheck={false}
            placeholder="Введите токен..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="pr-10 h-10"
          />
          <button
            type="button"
            className="absolute right-1 top-1/2 -translate-y-1/2 inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Скрыть токен" : "Показать токен"}
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          Токен сохраняется только в этом браузере (localStorage).
        </p>
      </div>
      <Button
        type="submit"
        disabled={!value.trim()}
        className="h-10 text-sm font-medium"
      >
        Войти
      </Button>
    </form>
  );
}
