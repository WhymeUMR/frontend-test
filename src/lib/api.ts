import type {
  Contragent,
  CreateSalePayload,
  Nomenclature,
  Organization,
  Paybox,
  PriceType,
  Warehouse,
} from "./api-types";

const API_BASE = "https://app.tablecrm.com/api/v1";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function buildUrl(path: string, params: Record<string, unknown>): string {
  const url = new URL(API_BASE + path);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) {
      for (const v of value) url.searchParams.append(key, String(v));
    } else {
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

async function request<T>(
  path: string,
  {
    method = "GET",
    token,
    query = {},
    body,
    signal,
  }: {
    method?: string;
    token: string;
    query?: Record<string, unknown>;
    body?: unknown;
    signal?: AbortSignal;
  },
): Promise<T> {
  const url = buildUrl(path, { token, ...query });
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  let data: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && "detail" in data
        ? String((data as { detail: unknown }).detail)
        : null) || `Запрос завершился со статусом ${res.status}`;
    throw new ApiError(message, res.status, data);
  }

  return data as T;
}

// tablecrm иногда возвращает массив, иногда { result: [...] } — нормализуем.
function extractList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === "object" && "result" in data) {
    const r = (data as { result: unknown }).result;
    if (Array.isArray(r)) return r as T[];
  }
  return [];
}

export const api = {
  contragents(
    token: string,
    params: { phone?: string; name?: string; limit?: number; offset?: number } = {},
    signal?: AbortSignal,
  ) {
    return request<unknown>("/contragents/", { token, query: params, signal }).then(
      extractList<Contragent>,
    );
  },

  organizations(token: string, signal?: AbortSignal) {
    return request<unknown>("/organizations/", {
      token,
      query: { limit: 100 },
      signal,
    }).then(extractList<Organization>);
  },

  warehouses(token: string, signal?: AbortSignal) {
    return request<unknown>("/warehouses/", {
      token,
      query: { limit: 100 },
      signal,
    }).then(extractList<Warehouse>);
  },

  payboxes(token: string, signal?: AbortSignal) {
    return request<unknown>("/payboxes/", {
      token,
      query: { limit: 100 },
      signal,
    }).then(extractList<Paybox>);
  },

  priceTypes(token: string, signal?: AbortSignal) {
    return request<unknown>("/price_types/", {
      token,
      query: { limit: 100 },
      signal,
    }).then(extractList<PriceType>);
  },

  nomenclature(
    token: string,
    params: { name?: string; limit?: number; offset?: number; with_prices?: boolean } = {},
    signal?: AbortSignal,
  ) {
    return request<unknown>("/nomenclature/", {
      token,
      query: { limit: 20, with_prices: true, ...params },
      signal,
    }).then(extractList<Nomenclature>);
  },

  createSale(token: string, payload: CreateSalePayload) {
    // Эндпоинт принимает массив документов (CreateMass).
    return request<unknown>("/docs_sales/", {
      method: "POST",
      token,
      body: [payload],
    });
  },
};
