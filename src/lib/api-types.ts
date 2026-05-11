// Типы основных сущностей tablecrm API (минимальный набор, нужный для формы заказа).

export interface Paged<T> {
  result: T[];
  total?: number;
  limit?: number;
  offset?: number;
  // tablecrm иногда возвращает плоский массив — обрабатываем оба варианта.
}

export interface Contragent {
  id: number;
  name: string;
  phone?: string | null;
  inn?: string | null;
  email?: string | null;
}

export interface Organization {
  id: number;
  name: string;
}

export interface Warehouse {
  id: number;
  name: string;
}

export interface Paybox {
  id: number;
  name: string;
}

export interface PriceType {
  id: number;
  name: string;
}

export interface NomenclaturePrice {
  price_type?: number;
  price: number;
}

export interface Nomenclature {
  id: number;
  name: string;
  unit?: number | null;
  unit_name?: string | null;
  price?: number | null;
  prices?: NomenclaturePrice[] | null;
}

// Payload для создания продажи (см. openapi: api__docs_sales__schemas__Create).
export interface SaleItemPayload {
  nomenclature: number;
  nomenclature_name?: string;
  price: number;
  quantity: number;
  unit?: number;
  unit_name?: string;
  price_type?: number;
  discount?: number;
  sum_discounted?: number;
  tax?: number;
}

export interface CreateSalePayload {
  number?: string;
  dated?: number;
  operation?: "Заказ" | "Реализация";
  comment?: string;
  contragent?: number;
  organization: number;
  warehouse?: number;
  paybox?: number;
  paid_rubles?: number;
  status?: boolean;
  tax_active?: boolean;
  tax_included?: boolean;
  goods: SaleItemPayload[];
}
