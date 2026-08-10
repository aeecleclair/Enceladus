"use client";

import { useAuth } from "../useAuth";
import { getCdrUsersTotalPaymentsPerType, getCdrUsersTotalPayments, getCdrUsersTotalPaymentsBySeller } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useTotalPaymentsPerType = () => {
  const { isTokenExpired } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["paymentsperType"],
    queryFn: async () => {
      const { data, error } = await getCdrUsersTotalPaymentsPerType();
      if (error) {
        throw error;
      }
      return data;
    },
    retry: 3,
    enabled: !isTokenExpired(),
  });

  return { data, isLoading, error, refetch };
};

export const useTotalPaymentsPerSeller = () => {
  const { isTokenExpired } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["paymentsperSeller"],
    queryFn: async () => {
      const { data, error } = await getCdrUsersTotalPaymentsBySeller();
      if (error) {
        throw error;
      }
      return data;
    },
    retry: 3,
    enabled: !isTokenExpired(),
  });

  return { data, isLoading, error, refetch };
};

export const useSumPayments = () => {
  const { isTokenExpired } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["payments-sum"],
    queryFn: async () => { await getCdrUsersTotalPayments();
      const { data, error } = await getCdrUsersTotalPayments();
      if (error) {
        throw error;
      }
      return data;
    },
    retry: 3,
    enabled: !isTokenExpired(),
  });

  return { data, isLoading, error, refetch };
}