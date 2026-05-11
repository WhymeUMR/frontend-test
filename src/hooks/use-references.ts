"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useOrganizations(token: string) {
  return useQuery({
    queryKey: ["organizations", token],
    queryFn: ({ signal }) => api.organizations(token, signal),
    staleTime: 5 * 60_000,
    enabled: !!token,
  });
}

export function useWarehouses(token: string) {
  return useQuery({
    queryKey: ["warehouses", token],
    queryFn: ({ signal }) => api.warehouses(token, signal),
    staleTime: 5 * 60_000,
    enabled: !!token,
  });
}

export function usePayboxes(token: string) {
  return useQuery({
    queryKey: ["payboxes", token],
    queryFn: ({ signal }) => api.payboxes(token, signal),
    staleTime: 5 * 60_000,
    enabled: !!token,
  });
}

export function usePriceTypes(token: string) {
  return useQuery({
    queryKey: ["price_types", token],
    queryFn: ({ signal }) => api.priceTypes(token, signal),
    staleTime: 5 * 60_000,
    enabled: !!token,
  });
}
