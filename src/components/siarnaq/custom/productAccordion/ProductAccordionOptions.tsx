import {
  AppModulesCdrSchemasCdrProductComplete,
  AppModulesCdrSchemasCdrProductEdit,
  deleteCdrSellersSellerIdProductsProductId,
  patchCdrSellersSellerIdProductsProductId,
} from "@/api";
import { CustomDialog } from "@/components/common/CustomDialog";
import { LoadingButton } from "@/components/common/LoadingButton";
import { AddEditProductForm } from "@/components/siarnaq/admin/sellerProducts/AddEditProductForm";
import _productFormSchema from "@/forms/siarnaq/productFormSchema";
import { useMemberships } from "@/hooks/siarnaq/useMemberships";
import { getModifiedFields } from "@/lib/siarnaq-utils";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import { Button } from "@/components/ui/button";
import {
  ContextMenuContent,
  ContextMenuShortcut,
} from "@/components/ui/context-menu";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";

import { PencilIcon, TrashIcon } from "lucide-react";

interface ProductAccordionOptionsProps {
  product: AppModulesCdrSchemasCdrProductComplete;
  sellerId: string;
  refreshProduct: () => void;
  canEdit?: boolean;
  canRemove?: boolean;
}

export const ProductAccordionOptions = ({
  product,
  sellerId,
  refreshProduct,
  canEdit,
  canRemove,
}: ProductAccordionOptionsProps) => {
  const tZod = useTranslations("siarnaq.productFormSchema");
  const productFormSchema = _productFormSchema(tZod);
  const t = useTranslations("siarnaq");
  const { toast } = useToast();
  const [isEditDialogOpened, setIsEditDialogOpened] = useState(false);
  const [isRemoveDialogOpened, setIsRemoveDialogOpened] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const { memberships } = useMemberships();

  const initialValues: z.infer<typeof productFormSchema> = {
    id: product.id,
    name_fr: product.name_fr,
    name_en: product.name_en || undefined,
    description_fr: product.description_fr || undefined,
    description_en: product.description_en || undefined,
    available_online: product.available_online ? "true" : "false",
    product_constraints:
      product.product_constraints?.map((constraint) => constraint.id) || [],
    document_constraints:
      product.document_constraints?.map((constraint) => constraint.id) || [],
    tickets: product.tickets
      ? product.tickets.map((ticket) => ({
          ...ticket,
          expiration: new Date(ticket.expiration),
        }))
      : [],
    related_membership: product.related_membership?.id || undefined,
    data_fields: [],
  };

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    mode: "onBlur",
    defaultValues: initialValues,
  });

  async function patchProduct(body: AppModulesCdrSchemasCdrProductEdit) {
    const { error } = await patchCdrSellersSellerIdProductsProductId({
      path: {
        product_id: product.id,
        seller_id: sellerId,
      },
      body: body,
    });
    if (error) {
      toast({
        description: error.detail,
        variant: "destructive",
      });
      setIsLoading(false);
      setIsEditDialogOpened(false);
      form.reset(initialValues);
      return;
    }
  }

  async function onSubmit(values: z.infer<typeof productFormSchema>) {
    setIsLoading(true);

    const resolvedValues: AppModulesCdrSchemasCdrProductEdit = {
      ...values,
      related_membership: values.related_membership
        ? memberships.find((m) => m.id == values.related_membership)
        : undefined,
      available_online: values.available_online === "true",
    };

    const resolvedInitial: typeof resolvedValues = {
      ...initialValues,
      related_membership: initialValues.related_membership
        ? memberships.find((m) => m.id == initialValues.related_membership)
        : undefined,
      available_online: initialValues.available_online === "true",
    };

    const diff = getModifiedFields(resolvedInitial, resolvedValues);

    if (Object.keys(diff).length === 0) {
      toast({
        description: t("productAccordionOptions.noEdition"),
      });
      setIsLoading(false);
      setIsEditDialogOpened(false);
      return;
    }

    await patchProduct(diff);
    refreshProduct();
    setIsEditDialogOpened(false);
    setIsLoading(false);
  }

  function closeDialog(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    setIsRemoveDialogOpened(false);
  }

  async function removeProduct() {
    setIsLoading(true);
    const { error } = await deleteCdrSellersSellerIdProductsProductId({
      path: {
        product_id: product.id,
        seller_id: sellerId,
      },
    });
    if (error) {
      toast({
        description: error.detail,
        variant: "destructive",
      });
      setIsLoading(false);
      setIsRemoveDialogOpened(false);
      toast({
        title: t("productAccordionOptions.customToast"),
        description: error.toString(),
      });
      return;
    }
    refreshProduct();
    setIsRemoveDialogOpened(false);
    setIsLoading(false);
  }
  return (
    (canEdit || canRemove) && (
      <ContextMenuContent className="w-40">
        {canEdit && (
          <CustomDialog
            isOpened={isEditDialogOpened}
            setIsOpened={setIsEditDialogOpened}
            title={t("productAccordionOptions.editProduct")}
            isFullWidth
            description={
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <AddEditProductForm
                    form={form}
                    setIsOpened={setIsEditDialogOpened}
                    isLoading={isLoading}
                    sellerId={sellerId}
                    productId={product.id}
                    isEdit
                  />
                </form>
              </Form>
            }
          >
            <Button className="w-full" variant="ghost">
              {t("productAccordionOptions.edit")}
              <ContextMenuShortcut>
                <PencilIcon className="w-4 h-4" />
              </ContextMenuShortcut>
            </Button>
          </CustomDialog>
        )}
        {canRemove && (
          <CustomDialog
            isOpened={isRemoveDialogOpened}
            setIsOpened={setIsRemoveDialogOpened}
            title={t("productAccordionOptions.deleteProduct")}
            isFullWidth
            description={
              <>
                <div>{t("productAccordionOptions.areYouSure")}</div>
                <div className="flex justify-end mt-2 space-x-4">
                  <Button
                    variant="outline"
                    onClick={closeDialog}
                    disabled={isLoading}
                    className="w-25"
                  >
                    {t("productAccordionOptions.cancel")}
                  </Button>
                  <LoadingButton
                    isLoading={isLoading}
                    className="w-25"
                    variant="destructive"
                    onClick={removeProduct}
                  >
                    {t("productAccordionOptions.delete")}
                  </LoadingButton>
                </div>
              </>
            }
          >
            <Button
              className="w-full text-destructive hover:text-destructive"
              variant="ghost"
            >
              {t("productAccordionOptions.delete")}
              <ContextMenuShortcut>
                <TrashIcon className="w-4 h-4 text-destructive" />
              </ContextMenuShortcut>
            </Button>
          </CustomDialog>
        )}
      </ContextMenuContent>
    )
  );
};
