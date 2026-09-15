"use client";

import { useAuth } from "../useAuth";

import {
  getCdrStatsPaymentTotal,
  getCdrStatsPaymentTotalBySeller,
  getCdrStatsPaymentTotalPerType,
} from "@/api";

import { useQuery } from "@tanstack/react-query";

export const useTotalPaymentsPerType = () => {
  const { isTokenExpired } = useAuth();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["paymentsperType"],
    queryFn: async () => {
      const { data, error } = await getCdrStatsPaymentTotalPerType();
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
      const { data, error } = await getCdrStatsPaymentTotalBySeller();
      if (error) {
        throw error;
      }
      if (!data) {
        throw new Error("No data returned");
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
    queryFn: async () => {
      const { data, error } = await getCdrStatsPaymentTotal();
      if (error) {
        throw error;
      }
      if (!data) {
        throw new Error("No data returned");
      }
      return data / 100;
    },
    retry: 3,
    enabled: !isTokenExpired(),
  });

  return { data, isLoading, error, refetch };
};
