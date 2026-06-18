"use client";

import { AddPaymentDialog } from "../validation/AddPaymentDialog";

import {
  AppModulesSportCompetitionSchemasSportCompetitionPaymentBase,
  AppModulesSportCompetitionSchemasSportCompetitionPaymentComplete,
  CompetitionUser,
} from "@/api";
import { useSchoolsPayments } from "@/hooks/challenger/useSchoolsPayments";
import { useSchoolsPurchases } from "@/hooks/challenger/useSchoolsPurchases";
import { useUserPayments } from "@/hooks/challenger/useUserPayments";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { CreditCard, Plus, Trash2 } from "lucide-react";
import { MoreHorizontal } from "lucide-react";

export const UserPayments = ({
  user,
  userPayments,
}: {
  user: CompetitionUser;
  userPayments: AppModulesSportCompetitionSchemasSportCompetitionPaymentComplete[];
}) => {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const { refetchSchoolsPayments } = useSchoolsPayments({
    schoolId: user.user.school_id,
  });
  const { refetchSchoolsPurchases } = useSchoolsPurchases({
    schoolId: user.user.school_id,
  });
  const { deleteUserPayment, makePayment, isPostingPayment } =
    useUserPayments();

  const onDeletePayment = (paymentId: string) => {
    deleteUserPayment(user.user_id, paymentId, () => {
      refetchSchoolsPayments();
      refetchSchoolsPurchases();
    });
  };

  const handleAddPayment = async (amount: number) => {
    const body: AppModulesSportCompetitionSchemasSportCompetitionPaymentBase = {
      total: amount * 100,
    };
    await makePayment(user.user_id, body);
    await refetchSchoolsPayments();
    await refetchSchoolsPurchases();
  };

  const totalPayments = userPayments.reduce(
    (sum, payment) => sum + payment.total,
    0,
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Paiements
            {userPayments.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {userPayments.length}
              </Badge>
            )}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPaymentDialogOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {userPayments.length > 0 ? (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Montant</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        {(payment.total / 100).toFixed(2)} €
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            payment.method === "manual"
                              ? "secondary"
                              : "default"
                          }
                        >
                          {payment.method === "manual" ? "Manuel" : "HelloAsso"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {payment.method === "manual" && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => onDeletePayment(payment.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 flex justify-end">
              <div className="text-sm">
                <span className="text-muted-foreground">Total: </span>
                <span className="font-bold text-lg">
                  {(totalPayments / 100).toFixed(2)} €
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Aucun paiement trouvé.
          </div>
        )}
      </CardContent>
      <AddPaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        onConfirm={handleAddPayment}
        participantName={user.user.name || user.user.firstname || "Utilisateur"}
        isLoading={isPostingPayment}
      />
    </Card>
  );
};
