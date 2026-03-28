import { Card, CardDescription, CardTitle } from "../../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { useState, useEffect } from "react";
import { BasketCard } from "./BasketCard";
import { RegistrationSummary } from "./RegistrationSummary";
import { editProductSchema, EditProductValues } from "@/src/forms/editProducts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserPurchases } from "@/src/hooks/useUserPurchases";
import { useUser } from "@/src/hooks/useUser";
import { Form } from "../../ui/form";
import { LoadingButton } from "../../custom/LoadingButton";
import {
  AppModulesSportCompetitionSchemasSportCompetitionPurchaseBase,
  Purchase,
} from "@/src/api/hyperionSchemas";
import { useAvailableProducts } from "@/src/hooks/useAvailableProducts";
import { licenseFormSchema, LicenseFormValues } from "@/src/forms/license";
import {
  substituteFormSchema,
  SubstituteFormValues,
} from "@/src/forms/substitute";
import { useParticipant } from "@/src/hooks/useParticipant";
import { StyledFormField } from "../../custom/StyledFormField";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
import { toast } from "../../ui/use-toast";
import { DocumentDialog } from "../../custom/DocumentDialog";
import { useDocument } from "@/src/hooks/useDocument";

interface WaitingPageProps {
  userMePurchases?: Purchase[];
}

export const WaitingPage = ({ userMePurchases }: WaitingPageProps) => {
  const { availableProducts } = useAvailableProducts();
  const { meParticipant, createParticipant, withdrawParticipant } =
    useParticipant();
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [licenseDialogOpen, setLicenseDialogOpen] = useState(false);
  const [substituteDialogOpen, setSubstituteDialogOpen] = useState(false);
  const [certificateDialogOpen, setCertificateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { me } = useUser();
  const { createPurchase, deletePurchase } = useUserPurchases({
    userId: me?.id,
  });
  const { data: certificateData, uploadDocument } = useDocument(me?.id ?? null);

  const licenseForm = useForm<LicenseFormValues>({
    resolver: zodResolver(licenseFormSchema),
    mode: "onChange",
    defaultValues: {
      license_number: meParticipant?.license || "",
      certificate: certificateData ? "Certificat chargé" : undefined,
    },
  });

  const substituteForm = useForm<SubstituteFormValues>({
    resolver: zodResolver(substituteFormSchema),
    mode: "onChange",
    defaultValues: {
      substitute: meParticipant?.substitute || false,
    },
  });

  useEffect(() => {
    if (certificateData) {
      licenseForm.setValue("certificate", "Certificat chargé");
    }
  }, [certificateData, licenseForm]);

  const onLicenseFormSubmit = (values: LicenseFormValues) => {
    if (!meParticipant?.sport_id) {
      setLicenseDialogOpen(false);
      toast({
        title: "Erreur",
        description: "Vous devez d'abord sélectionner un sport.",
        variant: "destructive",
      });
      return;
    }
    withdrawParticipant(meParticipant.sport_id, () =>
      createParticipant(
        {
          license: values.license_number!,
          team_id: meParticipant.team_id!,
          substitute: meParticipant.substitute,
        },
        meParticipant.sport_id,
        () => {
          setLicenseDialogOpen(false);
          if (values?.certificate) {
            uploadDocument(values.certificate, meParticipant.sport_id!, () => {
              toast({
                title: "Certificat mis à jour",
                description: `Ton certificat médical ont été mis à jour.`,
              });
            });
          } else {
            toast({
              title: "Licence mise à jour",
              description: `Ton numéro de licence a été mis à jour.`,
            });
          }
        },
      ),
    );
  };

  const onSubstituteFormSubmit = (values: SubstituteFormValues) => {
    if (!meParticipant?.sport_id) {
      setSubstituteDialogOpen(false);
      toast({
        title: "Erreur",
        description: "Vous devez d'abord sélectionner un sport.",
        variant: "destructive",
      });
      return;
    }
    withdrawParticipant(meParticipant.sport_id, () =>
      createParticipant(
        {
          license: meParticipant.license || "",
          team_id: meParticipant.team_id!,
          substitute: values.substitute,
        },
        meParticipant.sport_id,
        () => {
          setSubstituteDialogOpen(false);
          toast({
            title: "Statut de remplaçant mis à jour",
            description: `Vous êtes maintenant ${values.substitute ? "remplaçant" : "titulaire"}.`,
          });
        },
      ),
    );
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

    setIsLoading(false);
    setPurchaseDialogOpen(false);
  }

  return (
    <div className="flex w-full flex-col p-12 pt-6">
      <div className="space-y-6">
        <Card className="p-6 bg-red-700 text-white border-red-800 shadow-md shadow-red-500/50">
          <CardTitle>En attente de validation</CardTitle>
          <CardDescription className="text-white">
            Ton inscription est en cours de validation par ton BDS.
          </CardDescription>
        </Card>

        <Dialog open={purchaseDialogOpen} onOpenChange={setPurchaseDialogOpen}>
          <RegistrationSummary
            onPurchaseEdit={() => setPurchaseDialogOpen(true)}
            onLicenseEdit={() => setLicenseDialogOpen(true)}
            onSubstituteEdit={() => setSubstituteDialogOpen(true)}
            userMePurchases={userMePurchases}
          />
          <DialogContent>
            <Form {...productForm}>
              <form
                onSubmit={productForm.handleSubmit(onProductFormSubmit)}
                className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]"
              >
                <BasketCard form={productForm} />
                <LoadingButton type="submit" isLoading={isLoading}>
                  Valider
                </LoadingButton>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        <Dialog open={licenseDialogOpen} onOpenChange={setLicenseDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier la licence et le certificat</DialogTitle>
            </DialogHeader>
            <Form {...licenseForm}>
              <form onSubmit={licenseForm.handleSubmit(onLicenseFormSubmit)}>
                <div className="flex flex-col items-center gap-8">
                  <div className="flex flex-row items-center gap-8">
                    <StyledFormField
                      form={licenseForm}
                      label="Numéro de licence"
                      id="license_number"
                      input={(field) => <Input {...field} className="w-60" />}
                    />
                    <StyledFormField
                      form={licenseForm}
                      label="Certificat médical"
                      id="certificate"
                      input={(field) => (
                        <Dialog
                          open={certificateDialogOpen}
                          onOpenChange={setCertificateDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" className="w-60">
                              <span className="text-gray-500 overflow-hidden truncate">
                                {licenseForm.watch("certificate") ??
                                  "Aucun fichier sélectionné"}
                              </span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="md:max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-red sm:text-lg">
                                Ajouter un certificat médical
                              </DialogTitle>
                            </DialogHeader>
                            <DocumentDialog
                              setIsOpen={setCertificateDialogOpen}
                              field={field}
                              onFileRemove={() => {
                                licenseForm.setValue("certificate", null);
                              }}
                              onFileSet={(file) => {
                                licenseForm.setValue("certificate", file);
                              }}
                              sportId={meParticipant?.sport_id}
                            />
                          </DialogContent>
                        </Dialog>
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={!licenseForm.formState.isValid}
                  >
                    Enregistrer
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        <Dialog
          open={substituteDialogOpen}
          onOpenChange={setSubstituteDialogOpen}
        >
          <DialogContent>
            <Form {...substituteForm}>
              <form
                onSubmit={substituteForm.handleSubmit(onSubstituteFormSubmit)}
              >
                <div className="flex flex-col items-center gap-8">
                  <StyledFormField
                    form={substituteForm}
                    label="Remplaçant"
                    id="substitute"
                    input={(field) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="substitute"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <label
                          htmlFor="substitute"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Je suis remplaçant
                        </label>
                      </div>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={!substituteForm.formState.isValid}
                  >
                    Enregistrer
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
