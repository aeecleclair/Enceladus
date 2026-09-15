"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface TotalPaymentOfSeller {
  name: string;
  total_amount: number;
}

export interface TotalPaymentBySeller {
  total_amounts: TotalPaymentOfSeller[];
}

export function PaymentsTableSeller({ total_amounts }: TotalPaymentBySeller) {
  const sortedData = [...total_amounts].sort(
    (a, b) => b.total_amount - a.total_amount,
  );
  const totalSum = sortedData.reduce(
    (sum, item) => sum + item.total_amount,
    0,
  );

  const formatValue = (value: number) =>
    (value / 100).toLocaleString("fr-FR", {
      maximumFractionDigits: 2,
    });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vendeur</TableHead>
            <TableHead className="text-right">Montant</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.length ? (
            sortedData.map((item) => (
              <TableRow key={item.name}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-right">
                  {formatValue(item.total_amount)} €
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} className="h-24 text-center">
                Aucun résultat.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        {sortedData.length > 0 && (
          <TableBody>
            <TableRow className="border-t font-semibold">
              <TableCell>Total</TableCell>
              <TableCell className="text-right">
                {formatValue(totalSum)} €
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </div>
  );
}
