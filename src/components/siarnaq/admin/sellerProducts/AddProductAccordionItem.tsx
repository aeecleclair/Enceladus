import { AddEditProductForm } from "./AddEditProductForm";

import {
  AppModulesCdrSchemasCdrProductBase,
  SellerComplete,
  postCdrSellersSellerIdProducts,
  postCdrSellersSellerIdProductsProductIdData,
} from "@/api";
import { CustomDialog } from "@/components/common/CustomDialog";
import _productFormSchema from "@/forms/siarnaq/productFormSchema";
import { useSellerProducts } from "@/hooks/siarnaq/useSellerProducts";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { HiPlus } from "react-icons/hi2";
import z from "zod";

import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";

interface AddProductAccordionItemProps {
  seller: SellerComplete;
  refreshProduct: () => void;
}

export const AddProductAccordionItem = ({
  seller,
  refreshProduct,
}: AddProductAccordionItemProps) => {
  const tZod = useTranslations("siarnaq.productFormSchema");
  const productFormSchema = _productFormSchema(tZod);
  const t = useTranslations("siarnaq");
  const { toast } = useToast();
  const [isAddDialogOpened, setIsAddDialogOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const activeSellerId = searchParams.get("sellerId");
  const isSeller = !["cdradmin", "cdrrecap"].includes(activeSellerId ?? "");
  const { products } = useSellerProducts(isSeller ? activeSellerId : null);
  const hasInterestProduct = products.some(
    (product) => product.needs_validation === false,
  );

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    mode: "onBlur",
    defaultValues: {
      name_fr: "",
      name_en: "",
      description_en: "",
      description_fr: "",
      available_online: "false",
      related_membership_id: "null",
      product_constraints: [],
      document_constraints: [],
      data_fields: [],
      data_field_name: "",
      data_field_can_user_answer: false,
      tickets: [],
      ticket_name: "",
      ticket_max_use: "1",
    },
  });

  async function onSubmitInterestProduct() {
    setIsLoading(true);
    const body: AppModulesCdrSchemasCdrProductBase = {
      name_fr: "Interêt pour l'asso",
      name_en: "Interest for the club",
      available_online: false,
      needs_validation: false,
      product_constraints: [],
      document_constraints: [],
    };
    const { error } = await postCdrSellersSellerIdProducts({
      path: {
        seller_id: seller.id,
      },
      body: body,
    });
    if (error) {
      toast({
        description: error.detail,
        variant: "destructive",
      });
      setIsLoading(false);
      setIsAddDialogOpened(false);
      return;
    }
    refreshProduct();
    setIsAddDialogOpened(false);
    setIsLoading(false);
    form.reset();
  }

  async function onSubmit(values: z.infer<typeof productFormSchema>) {
    setIsLoading(true);
    const body: AppModulesCdrSchemasCdrProductBase = {
      ...values,
      available_online: values.available_online === "true",
      needs_validation: true,
      related_membership_id:
        values.related_membership_id === "null"
          ? null
          : values.related_membership_id,
      tickets: values.tickets.map((ticket) => ({
        ...ticket,
        expiration: ticket.expiration.toISOString(),
      })),
    };
    const { data, error } = await postCdrSellersSellerIdProducts({
      path: {
        seller_id: seller.id,
      },
      body: body,
    });
    if (error) {
      toast({
        description: error.detail,
        variant: "destructive",
      });
      setIsLoading(false);
      setIsAddDialogOpened(false);
      return;
    }
    const data_fields = values.data_fields;
    if (data && data_fields.length) {
      const dataFields = data_fields.map((dataField) => ({
        ...dataField,
        product_id: data.id,
      }));
      await Promise.all(
        dataFields.map((dataField) =>
          postCdrSellersSellerIdProductsProductIdData({
            body: {
              name: dataField.name,
              can_user_answer: dataField.can_user_answer,
            },
            path: { seller_id: seller.id, product_id: data.id },
          }),
        ),
      );
    }

    refreshProduct();
    setIsAddDialogOpened(false);
    setIsLoading(false);
    form.reset();
  }

  return (
    <div className="flex flex-1 flex-col py-4 font-medium cursor-pointer ">
      {!hasInterestProduct && (
        <button
          className="flex flex-1 items-center py-4 font-medium border-b cursor-pointer"
          onClick={onSubmitInterestProduct}
        >
          <HiPlus className="w-4 h-4 mr-6" />
          <h3 className="text-lg font-semibold">
            {t("addProductAccordionItem.interest")}
          </h3>
          <div className="flex grow"></div>
        </button>
      )}
      <CustomDialog
        title={t("addProductAccordionItem.newProduct")}
        isFullWidth
        description={
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <AddEditProductForm
                form={form}
                setIsOpened={setIsAddDialogOpened}
                isLoading={isLoading}
                sellerId={seller.id}
              />
            </form>
          </Form>
        }
        isOpened={isAddDialogOpened}
        setIsOpened={setIsAddDialogOpened}
      >
        <div className="flex flex-1 items-center pt-4">
          <HiPlus className="w-4 h-4 mr-6" />
          <h3 className="text-lg font-semibold">
            {t("addProductAccordionItem.newProduct")}
          </h3>
          <div className="flex grow"></div>
        </div>
      </CustomDialog>
    </div>
  );
};
