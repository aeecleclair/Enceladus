"use client";

import { PaymentsTableSeller } from "@/components/siarnaq/admin/sellerProducts/PaymentTableSeller";
import { PaymentsTableType } from "@/components/siarnaq/admin/sellerProducts/PaymentTableType";
import {
  useSumPayments,
  useTotalPaymentsPerSeller,
  useTotalPaymentsPerType,
} from "@/hooks/siarnaq/useCdrPayments";

import { Suspense } from "react";

import { Card } from "@/components/ui/card";

const PaymentsPage = () => {
  const {
    data: data1,
    isLoading: isLoading1,
    error: error1,
  } = useTotalPaymentsPerType();

  const {
    data: data2,
    isLoading: isLoading2,
    error: error2,
  } = useTotalPaymentsPerSeller();
  const {
    data: data3,
    isLoading: isLoading3,
    error: error3,
  } = useSumPayments();

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 md:gap-8 min-h-[--custom-vh] pb-8 bg-muted/40">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex-col gap-4 md:flex-row md:items-start">
          <div className="flex flex-col items-center">
            <Card className="p-6 md:flex-1 text-center">
              <h1 className="text-lg font-semibold">Recette totale</h1>
              {isLoading3 && (
                <p className="text-muted-foreground">Chargement...</p>
              )}
              {error3 && (
                <p className="text-destructive">
                  Erreur lors du chargement des paiements.
                </p>
              )}
              {!isLoading3 && !error3 && (
                <p className="text-lg font-semibold">{data3 ?? 0} €</p>
              )}
            </Card>
          </div>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <Card className="p-6 md:flex-1">
            <h2 className="text-lg font-semibold p-2">Paiements par type</h2>
            {isLoading1 && (
              <p className="text-muted-foreground">Chargement...</p>
            )}
            {error1 && (
              <p className="text-destructive">
                Erreur lors du chargement des paiements.
              </p>
            )}
            {!isLoading1 && !error1 && <PaymentsTableType data={data1 ?? []} />}
          </Card>

          <Card className="p-6 md:flex-1">
            <h2 className="text-lg font-semibold p-2">Paiements par vendeur</h2>
            {isLoading2 && (
              <p className="text-muted-foreground">Chargement...</p>
            )}
            {error2 && (
              <p className="text-destructive">
                Erreur lors du chargement des paiements.
              </p>
            )}
            {!isLoading2 && !error2 && (
              <PaymentsTableSeller data={data2 ?? []} />
            )}
          </Card>
        </div>
      </Suspense>
    </main>
  );
};

export default PaymentsPage;
