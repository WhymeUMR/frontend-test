"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Building2,
  Package,
  Receipt,
  ShoppingBag,
  User,
  Warehouse,
} from "lucide-react";

import type { Contragent, CreateSalePayload } from "@/lib/api-types";
import { api } from "@/lib/api";
import { useToken } from "@/components/token-provider";
import {
  useOrganizations,
  usePayboxes,
  usePriceTypes,
  useWarehouses,
} from "@/hooks/use-references";
import { useCart } from "@/hooks/use-cart";
import { ContragentField } from "./contragent-field";
import { NomenclaturePicker } from "./nomenclature-picker";
import { OrderSummary } from "./order-summary";
import { SectionCard } from "./section-card";
import { SelectField } from "./select-field";

export function OrderForm() {
  const { token } = useToken();

  const [contragent, setContragent] = useState<Contragent | null>(null);
  const [organizationId, setOrganizationId] = useState<number | null>(null);
  const [warehouseId, setWarehouseId] = useState<number | null>(null);
  const [payboxId, setPayboxId] = useState<number | null>(null);
  const [priceTypeId, setPriceTypeId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const orgsQuery = useOrganizations(token!);
  const warehousesQuery = useWarehouses(token!);
  const payboxesQuery = usePayboxes(token!);
  const priceTypesQuery = usePriceTypes(token!);
  const cart = useCart();

  if (!token) return null;

  const canSubmit = !!organizationId && !submitting;

  const buildPayload = (): CreateSalePayload => ({
    organization: organizationId!,
    contragent: contragent?.id,
    warehouse: warehouseId ?? undefined,
    paybox: payboxId ?? undefined,
    operation: "Заказ",
    goods: cart.items.map((item) => ({
      nomenclature: item.nomenclature.id,
      nomenclature_name: item.nomenclature.name,
      quantity: item.quantity,
      price: item.price,
      price_type: item.priceTypeId ?? undefined,
      unit: item.nomenclature.unit ?? undefined,
      unit_name: item.nomenclature.unit_name ?? undefined,
    })),
  });

  const handleSubmit = async (generateOut: boolean) => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const payload = buildPayload();
      // Если "Создать и провести" — для проведения нужен статус=true.
      if (generateOut) payload.status = true;
      const res = (await api.createSale(token, payload, { generateOut })) as
        | { id?: number }[]
        | { id?: number }
        | null;
      const createdId = Array.isArray(res) ? res[0]?.id : res?.id;
      const title = generateOut
        ? "Продажа создана и проведена"
        : "Продажа создана";
      toast.success(title, {
        description: createdId ? `ID: ${createdId}` : undefined,
      });
      // Сброс формы после успешного создания.
      cart.clearCart();
      setContragent(null);
      setOrganizationId(null);
      setWarehouseId(null);
      setPayboxId(null);
      setPriceTypeId(null);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Не удалось создать продажу";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <form className="flex flex-col gap-4 pb-40">
        <SectionCard
          step={1}
          icon={<User className="size-4" />}
          title="Клиент"
          description="Поиск контрагента по телефону"
        >
          <ContragentField
            token={token}
            value={contragent}
            onChange={setContragent}
          />
        </SectionCard>

        <SectionCard
          step={2}
          icon={<Building2 className="size-4" />}
          title="Параметры продажи"
          description="Организация, склад, счёт и тип цен"
        >
          <SelectField
            id="organization"
            label="Организация"
            icon={<Building2 className="size-3.5" />}
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
            icon={<Warehouse className="size-3.5" />}
            placeholder="Выберите склад"
            options={warehousesQuery.data}
            loading={warehousesQuery.isLoading}
            value={warehouseId}
            onChange={setWarehouseId}
          />

          <SelectField
            id="paybox"
            label="Счёт"
            icon={<Receipt className="size-3.5" />}
            placeholder="Выберите счёт"
            options={payboxesQuery.data}
            loading={payboxesQuery.isLoading}
            value={payboxId}
            onChange={setPayboxId}
          />

          <SelectField
            id="price_type"
            label="Тип цен"
            icon={<Package className="size-3.5" />}
            placeholder="Выберите тип цен"
            options={priceTypesQuery.data}
            loading={priceTypesQuery.isLoading}
            value={priceTypeId}
            onChange={setPriceTypeId}
          />
        </SectionCard>

        <SectionCard
          step={3}
          icon={<ShoppingBag className="size-4" />}
          title="Товары"
          description="Добавьте позиции в продажу"
        >
          <NomenclaturePicker
            token={token}
            priceTypeId={priceTypeId}
            items={cart.items}
            onAdd={cart.addItem}
            onRemove={cart.removeItem}
            onQtyChange={cart.updateQuantity}
            onPriceChange={cart.updatePrice}
          />
        </SectionCard>
      </form>

      <OrderSummary
        items={cart.items}
        total={cart.total}
        canSubmit={canSubmit}
        submitting={submitting}
        onCreateSale={() => handleSubmit(false)}
        onCreateAndPost={() => handleSubmit(true)}
      />
    </>
  );
}
