"use client";

import { useState } from "react";
import type { Contragent } from "@/lib/api-types";
import { useToken } from "@/hooks/use-token";
import {
  useOrganizations,
  usePayboxes,
  usePriceTypes,
  useWarehouses,
} from "@/hooks/use-references";
import { ContragentField } from "./contragent-field";
import { SelectField } from "./select-field";
import { Separator } from "@/components/ui/separator";

export function OrderForm() {
  const { token } = useToken();

  const [contragent, setContragent] = useState<Contragent | null>(null);
  const [organizationId, setOrganizationId] = useState<number | null>(null);
  const [warehouseId, setWarehouseId] = useState<number | null>(null);
  const [payboxId, setPayboxId] = useState<number | null>(null);
  const [priceTypeId, setPriceTypeId] = useState<number | null>(null);

  const orgsQuery = useOrganizations(token!);
  const warehousesQuery = useWarehouses(token!);
  const payboxesQuery = usePayboxes(token!);
  const priceTypesQuery = usePriceTypes(token!);

  if (!token) return null;

  return (
    <form className="flex flex-col gap-5 pb-24">
      <ContragentField
        token={token}
        value={contragent}
        onChange={setContragent}
      />

      <Separator />

      <SelectField
        id="organization"
        label="Организация"
        placeholder="Выберите организацию"
        options={orgsQuery.data}
        loading={orgsQuery.isLoading}
        value={organizationId}
        onChange={setOrganizationId}
        required
      />

      <SelectField
        id="warehouse"
        label="Склад"
        placeholder="Выберите склад"
        options={warehousesQuery.data}
        loading={warehousesQuery.isLoading}
        value={warehouseId}
        onChange={setWarehouseId}
      />

      <SelectField
        id="paybox"
        label="Счёт"
        placeholder="Выберите счёт"
        options={payboxesQuery.data}
        loading={payboxesQuery.isLoading}
        value={payboxId}
        onChange={setPayboxId}
      />

      <SelectField
        id="price_type"
        label="Тип цен"
        placeholder="Выберите тип цен"
        options={priceTypesQuery.data}
        loading={priceTypesQuery.isLoading}
        value={priceTypeId}
        onChange={setPriceTypeId}
      />
    </form>
  );
}
