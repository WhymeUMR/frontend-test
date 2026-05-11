"use client";

import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Option {
  id: number;
  name: string;
}

interface SelectFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  options: Option[] | undefined;
  loading?: boolean;
  value: number | null;
  onChange: (id: number | null) => void;
  required?: boolean;
  icon?: ReactNode;
}

export function SelectField({
  id,
  label,
  placeholder = "Не выбрано",
  options,
  loading,
  value,
  onChange,
  required,
  icon,
}: SelectFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-[12px] font-medium text-muted-foreground">
        {icon ? <span className="text-muted-foreground/80">{icon}</span> : null}
        {label}
        {required ? <span className="text-destructive ml-0.5">*</span> : null}
      </Label>

      {loading ? (
        <div className="flex h-10 items-center gap-2 rounded-lg border border-input bg-background px-3 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          <span>Загрузка...</span>
        </div>
      ) : (
        <Select
          value={value === null ? "" : String(value)}
          onValueChange={(v) => {
            const n = Number(v);
            onChange(Number.isFinite(n) && n > 0 ? n : null);
          }}
        >
          <SelectTrigger id={id} size="default" className="w-full h-10 bg-background">
            <SelectValue placeholder={placeholder}>
              {(v) => {
                if (!v) return placeholder;
                const found = (options ?? []).find((o) => String(o.id) === v);
                return found?.name ?? placeholder;
              }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {(options ?? []).map((o) => (
              <SelectItem key={o.id} value={String(o.id)}>
                {o.name}
              </SelectItem>
            ))}
            {(options ?? []).length === 0 ? (
              <div className="px-2 py-3 text-sm text-muted-foreground">
                Список пуст
              </div>
            ) : null}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
