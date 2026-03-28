"use client";

import { UserCompetition } from "@/src/components/admin/userDetails/UserCompetition";
import { UserInfo } from "@/src/components/admin/userDetails/UserInfo";
import { UserPayments } from "@/src/components/admin/userDetails/UserPayments";
import { UserPurchases } from "@/src/components/admin/userDetails/UserPurchases";
import { Button } from "@/src/components/ui/button";
import { AddPaymentDialog } from "@/src/components/admin/validation/AddPaymentDialog";
import { ConfirmActionDialog } from "@/src/components/admin/users/ConfirmActionDialog";
import { EditCompetitionUserDialog } from "@/src/components/admin/users/EditCompetitionUserDialog";
import { CancelCompetitionUserDialog } from "@/src/components/admin/users/CancelCompetitionUserDialog";
import { ChangeUserSportDialog } from "@/src/components/admin/users/ChangeUserSportDialog";
import { ChangeUserTeamDialog } from "@/src/components/admin/users/ChangeUserTeamDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { useAdminPurchases } from "@/src/hooks/useAdminPurchases";
import { useCompetitionUsers } from "@/src/hooks/useCompetitionUsers";
import { useParticipant } from "@/src/hooks/useParticipant";
import { useProducts } from "@/src/hooks/useProducts";
import { useSchoolParticipants } from "@/src/hooks/useSchoolParticipants";
import { useSchoolsPayments } from "@/src/hooks/useSchoolsPayments";
import { useSchoolsPurchases } from "@/src/hooks/useSchoolsPurchases";
import { useUserPayments } from "@/src/hooks/useUserPayments";
import { useUser } from "@/src/hooks/useUser";
import {
  ArrowLeft,
  Users,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Trash2,
  Ban,
  Shuffle,
  Users2,
  CreditCard,
  Pencil,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import React from "react";
import {
  AppModulesSportCompetitionSchemasSportCompetitionPaymentBase,
  CompetitionUserEdit,
} from "@/src/api/hyperionSchemas";

const UserDetailsPage = () => {
  const searchParam = useSearchParams();
  const userId = searchParam.get("user_id");
  const { me: currentUser, isAdmin } = useUser();

  const {
    competitionUsers,
    validateCompetitionUser,
    isValidateLoading,
    invalidateCompetitionUser,
    isInvalidateLoading,
    deleteCompetitionUser,
    isDeleteLoading,
    cancelCompetitionUser,
    isCancelLoading,
    updateCompetitionUser,
    isUpdateLoading,
  } = useCompetitionUsers();
  const userCompetition = competitionUsers
    ? competitionUsers.find((cu) => cu.user_id === userId)
    : undefined;
  const schoolId = userCompetition?.user.school_id;

  const { products } = useProducts();

  const { schoolParticipants } = useSchoolParticipants({
    schoolId: schoolId || "",
  });
  const userParticipant = schoolParticipants
    ? schoolParticipants.find((sp) => sp.user_id === userId)
    : undefined;

  const { schoolsPurchases, refetchSchoolsPurchases } = useSchoolsPurchases({
    schoolId: schoolId || "",
  });
  const userPurchases = schoolsPurchases
    ? schoolsPurchases[userId as string]
    : undefined;

  const { schoolsPayments } = useSchoolsPayments({
    schoolId: schoolId || "",
  });
  const userPayments = schoolsPayments
    ? schoolsPayments[userId as string]
    : undefined;

  const { deleteParticipant } = useParticipant();
  const { makePayment, isPostingPayment } = useUserPayments();

  // Dialog state
  const [validateDialogOpen, setValidateDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false);
  const [changeSportOpen, setChangeSportOpen] = React.useState(false);
  const [changeTeamOpen, setChangeTeamOpen] = React.useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = React.useState(false);
  const [editUserOpen, setEditUserOpen] = React.useState(false);

  const {
    createPurchase,
    isCreatePurchaseLoading,
    editPurchase,
    isEditPurchaseLoading,
    deletePurchase,
    isDeletePurchaseLoading,
  } = useAdminPurchases();

  const onValidate = () => {
    validateCompetitionUser(userId!, () => {});
  };
  const onInvalidate = () => {
    invalidateCompetitionUser(userId!, () => {});
  };
  const onDelete = () => {
    if (userParticipant)
      deleteParticipant(userParticipant.sport_id, userId!, () => {
        deleteCompetitionUser(userId!, () => {});
      });
    else deleteCompetitionUser(userId!, () => {});
  };
  const onCancel = () => {
    cancelCompetitionUser(userId!, () => {});
  };
  const onEditUser = (body: CompetitionUserEdit) => {
    const finalBody = userCompetition?.cancelled
      ? { ...body, cancelled: false }
      : body;
    updateCompetitionUser(userId!, finalBody, () => {
      setEditUserOpen(false);
    });
  };
  const handleAddPayment = async (amount: number) => {
    const body: AppModulesSportCompetitionSchemasSportCompetitionPaymentBase = {
      total: amount * 100,
    };
    await makePayment(userId!, body);
  };
  if (!isAdmin()) {
    return <div className="p-6">Vous n&apos;avez pas accès à cette page</div>;
  }
  const userName =
    userCompetition?.user.firstname || userCompetition?.user.name
      ? `${userCompetition.user.firstname || ""} ${userCompetition.user.name || ""}`.trim()
      : "Utilisateur";
  return (
    <div className="flex w-full flex-col space-y-6">
      <div>Détails de l&apos;utilisateur</div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            {userName}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              const schoolIdParam = searchParam.get("school_id");
              if (schoolIdParam) {
                window.location.href = `/admin/validation?school_id=${schoolIdParam}`;
              } else {
                window.history.back();
              }
            }}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          {userCompetition && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <MoreHorizontal className="h-4 w-4" />
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setValidateDialogOpen(true)}
                  disabled={isValidateLoading || isInvalidateLoading}
                >
                  {userCompetition.validated ? (
                    <>
                      <XCircle className="mr-2 h-4 w-4" />
                      Invalider
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Valider
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPaymentDialogOpen(true)}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Enregistrer un paiement
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEditUserOpen(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Modifier
                </DropdownMenuItem>
                {userParticipant && (
                  <DropdownMenuItem onClick={() => setChangeSportOpen(true)}>
                    <Shuffle className="mr-2 h-4 w-4" />
                    Changer de sport
                  </DropdownMenuItem>
                )}
                {userParticipant?.team && (
                  <DropdownMenuItem onClick={() => setChangeTeamOpen(true)}>
                    <Users2 className="mr-2 h-4 w-4" />
                    Changer d&apos;équipe
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-orange-600 focus:text-orange-600 focus:bg-orange-50"
                  onClick={() => setCancelDialogOpen(true)}
                  disabled={isCancelLoading}
                >
                  <Ban className="mr-2 h-4 w-4" />
                  Désinscrire
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  onClick={() => setDeleteDialogOpen(true)}
                  disabled={isDeleteLoading}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {userCompetition ? (
        <UserInfo user={userCompetition} />
      ) : (
        <div>Utilisateur non trouvé</div>
      )}
      {userCompetition && (
        <UserCompetition
          user={userCompetition}
          userParticipant={userParticipant}
        />
      )}
      {userPurchases && products && (
        <UserPurchases
          userPurchases={userPurchases}
          products={products}
          isAdmin={isAdmin()}
          isUserValidated={userCompetition?.validated ?? false}
          userId={userId as string}
          onCreatePurchase={(productVariantId, quantity) => {
            createPurchase(
              userId as string,
              { product_variant_id: productVariantId, quantity },
              () => {
                refetchSchoolsPurchases();
              },
            );
          }}
          isCreateLoading={isCreatePurchaseLoading}
          onEditPurchase={(variantId, quantity) => {
            editPurchase(userId as string, variantId, { quantity }, () => {
              refetchSchoolsPurchases();
            });
          }}
          isEditLoading={isEditPurchaseLoading}
          onDeletePurchase={(productVariantId) => {
            deletePurchase(userId as string, productVariantId, () => {
              refetchSchoolsPurchases();
            });
          }}
          isDeleteLoading={isDeletePurchaseLoading}
        />
      )}
      {userPayments && userCompetition && (
        <UserPayments user={userCompetition} userPayments={userPayments} />
      )}

      {/* Dialogs */}
      <ConfirmActionDialog
        open={validateDialogOpen}
        onClose={() => setValidateDialogOpen(false)}
        onConfirm={() => {
          userCompetition?.validated ? onInvalidate() : onValidate();
          setValidateDialogOpen(false);
        }}
        isLoading={isValidateLoading || isInvalidateLoading}
        title={
          userCompetition?.validated
            ? "Invalider le participant"
            : "Valider le participant"
        }
        description={
          userCompetition?.validated ? (
            <span>
              Voulez-vous invalider l&apos;inscription de{" "}
              <strong>{userName}</strong>&nbsp;?
            </span>
          ) : (
            <span>
              Voulez-vous valider l&apos;inscription de{" "}
              <strong>{userName}</strong>&nbsp;?
            </span>
          )
        }
        confirmLabel={userCompetition?.validated ? "Invalider" : "Valider"}
        variant={userCompetition?.validated ? "destructive" : "default"}
      />
      <ConfirmActionDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={() => {
          onDelete();
          setDeleteDialogOpen(false);
        }}
        isLoading={isDeleteLoading}
        title="Supprimer le participant"
        description={
          <span>
            Voulez-vous supprimer définitivement l&apos;inscription de{" "}
            <strong>{userName}</strong>&nbsp;?
          </span>
        }
        confirmLabel="Supprimer"
        variant="destructive"
        warning={
          <>
            <p className="font-semibold mb-1">
              ⚠️ Cette action est irréversible
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>L&apos;inscription sera définitivement supprimée</li>
              <li>Les données associées seront perdues</li>
            </ul>
          </>
        }
      />
      <CancelCompetitionUserDialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        onConfirm={() => {
          onCancel();
          setCancelDialogOpen(false);
        }}
        isLoading={isCancelLoading}
        userName={userName}
      />
      {userParticipant && (
        <ChangeUserSportDialog
          open={changeSportOpen}
          onClose={() => setChangeSportOpen(false)}
          onSuccess={() => setChangeSportOpen(false)}
          userId={userId!}
          currentSportId={userParticipant.sport_id}
          schoolId={schoolId || ""}
        />
      )}
      {userParticipant?.team && (
        <ChangeUserTeamDialog
          open={changeTeamOpen}
          onClose={() => setChangeTeamOpen(false)}
          onSuccess={() => setChangeTeamOpen(false)}
          userId={userId!}
          sportId={userParticipant.sport_id}
          schoolId={schoolId || ""}
        />
      )}
      <AddPaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        onConfirm={handleAddPayment}
        participantName={userName}
        isLoading={isPostingPayment}
      />
      {userCompetition && (
        <EditCompetitionUserDialog
          open={editUserOpen}
          onClose={() => setEditUserOpen(false)}
          onConfirm={onEditUser}
          isLoading={isUpdateLoading}
          user={userCompetition}
        />
      )}
    </div>
  );
};

export default UserDetailsPage;
