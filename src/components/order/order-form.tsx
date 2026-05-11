"use client";

import { useState } from "react";
import type { Contragent } from "@/lib/api-types";
import { useToken } from "@/hooks/use-token";
import { ContragentField } from "./contragent-field";

export function OrderForm() {
  const { token } = useToken();
  const [contragent, setContragent] = useState<Contragent | null>(null);

  if (!token) return null;

  return (
    <form className="flex flex-col gap-5">
      <ContragentField
        token={token}
        value={contragent}
        onChange={setContragent}
      />
    </form>
  );
}
