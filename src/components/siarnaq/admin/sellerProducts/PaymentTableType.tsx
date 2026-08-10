"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface PaymentDatum {
  payment_type: string;
  total: number;
}

interface PaymentsTableProps {
  data: PaymentDatum[];
}

export function PaymentsTableType({ data }: PaymentsTableProps) {
  const sortedData = [...data].sort((a, b) => b.total - a.total);
  const totalSum = sortedData.reduce((sum, item) => sum + item.total, 0);

  const formatValue = (value: number) =>
    (value / 100).toLocaleString("fr-FR", {
      maximumFractionDigits: 2,
    });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type de paiement</TableHead>
            <TableHead className="text-right">Montant</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.length ? (
            sortedData.map((item) => (
              <TableRow key={item.payment_type}>
                <TableCell className="font-medium">
                  {item.payment_type}
                </TableCell>
                <TableCell className="text-right">
                  {formatValue(item.total)} €
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