import { CheckCircle2, CreditCard } from "lucide-react";
import { useState } from "react";
import { Card, CardDescription, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { WarningDialog } from "../../custom/WarningDialog";
import { HelloAssoButton } from "../../custom/HelloAssoButton";
import { RegistrationSummary } from "./RegistrationSummary";
import { usePayment } from "../../../hooks/usePayment";
import { useUserPayments } from "../../../hooks/useUserPayments";
import { Dialog, DialogContent, DialogTitle } from "../../ui/dialog";
import { Form } from "../../ui/form";
import { BasketCard } from "./BasketCard";
import { LoadingButton } from "../../custom/LoadingButton";
import { useForm } from "react-hook-form";
import { editProductSchema, EditProductValues } from "@/src/forms/editProducts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAvailableProducts } from "@/src/hooks/useAvailableProducts";
import { useUser } from "@/src/hooks/useUser";
import { useUserPurchases } from "@/src/hooks/useUserPurchases";
import {
  AppModulesSportCompetitionSchemasSportCompetitionPurchaseBase,
  Purchase,
} from "@/src/api/hyperionSchemas";
import { useCompetitionUser } from "@/src/hooks/useCompetitionUser";
import { useRouter } from "next/navigation";

interface ValidatedPageProps {
  userMePurchases?: Purchase[];
}

export const ValidatedPage = ({ userMePurchases }: ValidatedPageProps) => {
  const router = useRouter();
  const { availableProducts } = useAvailableProducts();
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { me } = useUser();
  const { createPurchase, deletePurchase } = useUserPurchases({
    userId: me?.id,
  });
  const { refetchMeCompetition } = useCompetitionUser();
  const [isPaymentDialogOpened, setIsPaymentDialogOpened] = useState(false);

  const { getPaymentUrl, isPaymentLoading } = usePayment();
  const { hasPaid, isLoading: isPaymentsLoading } = useUserPayments();

  const handlePaymentRefetch = () => {
    getPaymentUrl((paymentUrl) => {
      setIsPaymentDialogOpened(false);
      router.push(paymentUrl);
    });
  };

  const productForm = useForm<EditProductValues>({
    resolver: zodResolver(editProductSchema),
    mode: "onChange",
    defaultValues: {
      products:
        userMePurchases
          ?.map((purchase) => {
            const productItem = availableProducts?.find(
              (product) => product.id === purchase.product_variant_id,
            );
            if (!productItem) return undefined;
            return {
              product: productItem,
              quantity: purchase.quantity,
            };
          })
          .filter((item) => item !== undefined) || [],
    },
  });

  async function onProductFormSubmit(values: EditProductValues) {
    setIsLoading(true);
    const newPurchases = values.products;

    const requiredProductIds = availableProducts
      ? availableProducts
          .filter((product) => product.product.required === true)
          .map((product) => product.id)
      : [];

    const allPurchasesProductIds = newPurchases.map(
      (purchase) => purchase.product.id,
    );

    const hasAllRequired = requiredProductIds.some((id) =>
      allPurchasesProductIds.includes(id),
    );

    if (!hasAllRequired) {
      for (const id of requiredProductIds) {
        if (!allPurchasesProductIds.includes(id)) {
          const productName = availableProducts?.find(
            (product) => product.product_id === id,
          )?.product.name;
          const index = newPurchases.findIndex(
            (purchase) => purchase.product.id === id,
          );
          productForm.setError(
            index !== -1 ? `products.${index}` : "products",
            {
              type: "manual",
              message: `Le produit ${productName} est requis.`,
            },
          );
        }
      }
      return;
    }

    const toCreate = newPurchases.filter(
      (newPurchase) =>
        !userMePurchases?.some(
          (purchase) =>
            purchase.product_variant_id === newPurchase.product.id &&
            purchase.quantity === newPurchase.quantity,
        ),
    );
    const toDelete = userMePurchases?.filter(
      (purchase) =>
        !newPurchases.some(
          (newPurchase) =>
            newPurchase.product.id === purchase.product_variant_id,
        ),
    );

    toDelete?.map((purchase) => {
      deletePurchase(purchase.product_variant_id, () => {});
    });

    toCreate.map((purchase) => {
      const body: AppModulesSportCompetitionSchemasSportCompetitionPurchaseBase =
        {
          product_variant_id: purchase.product.id,
          quantity: purchase.quantity,
        };
      createPurchase(body, () => {});
    });

    await refetchMeCompetition();

    setIsLoading(false);
    setPurchaseDialogOpen(false);
  }

  return (
    <div className="flex w-full flex-col p-12 pt-6">
      <div className="space-y-6">
        <Card className="p-6 bg-green-700 text-white border-green-800 shadow-md shadow-green-500/50">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Inscription validée
          </CardTitle>
          <CardDescription className="text-white">
            Félicitations ! Ton inscription a été validée par ton BDS. Tu
            recevras bientôt plus d&apos;informations par e-mail concernant la
            compétition.
          </CardDescription>
        </Card>

        {!isPaymentsLoading && !hasPaid && (
          <Card className="p-6 bg-gray-50 border-gray-200">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <CreditCard className="h-5 w-5" />
              Finaliser votre inscription
            </CardTitle>
            <CardDescription className="text-gray-700 mb-4">
              Pour compléter votre inscription, veuillez procéder au paiement de
              votre participation à la compétition.
            </CardDescription>

            <WarningDialog
              isOpened={isPaymentDialogOpened}
              setIsOpened={setIsPaymentDialogOpened}
              isLoading={isPaymentLoading}
              title="Procéder au paiement"
              description={
                <p>
                  Vous allez être redirigés vers HelloAsso pour procéder au
                  paiement. HelloAsso est une entreprise française proposant des
                  solutions de paiement pour les associations. Elle se finance
                  uniquement par des dons. Par défaut, HelloAsso vous proposera
                  de faire un don (nommé &apos;contribution volontaire&apos;),
                  vous pouvez refuser de le faire sans compromettre le paiement.
                  Si vous choisissez de faire un don, seul HelloAsso en
                  bénéficiera.
                </p>
              }
              customButton={
                <HelloAssoButton
                  isLoading={isPaymentLoading}
                  onClick={handlePaymentRefetch}
                />
              }
            />

            <Button
              className="w-full sm:w-auto"
              onClick={() => setIsPaymentDialogOpened(true)}
              disabled={isPaymentLoading}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Procéder au paiement
            </Button>
          </Card>
        )}

        {!isPaymentsLoading && hasPaid && (
          <Card className="p-6 bg-green-100 border-green-300">
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle2 className="h-5 w-5" />
              Paiement effectué
            </CardTitle>
            <CardDescription className="text-green-700">
              Votre paiement a été effectué avec succès. Votre inscription est
              maintenant complète !
            </CardDescription>
          </Card>
        )}
        <Dialog open={purchaseDialogOpen} onOpenChange={setPurchaseDialogOpen}>
          <DialogTitle className="text-2xl font-bold mb-4">
            Modifier ma formule
          </DialogTitle>
          <RegistrationSummary
            onPurchaseEdit={() => setPurchaseDialogOpen(true)}
            userMePurchases={userMePurchases}
          />
          <DialogContent className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
            <Form {...productForm}>
              <form
                onSubmit={productForm.handleSubmit(onProductFormSubmit)}
                className="space-y-4"
              >
                <BasketCard form={productForm} />
                <LoadingButton type="submit" isLoading={isLoading}>
                  Valider
                </LoadingButton>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
