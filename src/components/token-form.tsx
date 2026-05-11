"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToken } from "@/hooks/use-token";

export function TokenForm() {
  const { setToken } = useToken();
  const [value, setValue] = useState("");

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
        <Input
          id="token"
          autoComplete="off"
          spellCheck={false}
          placeholder="af1874616430..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
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
