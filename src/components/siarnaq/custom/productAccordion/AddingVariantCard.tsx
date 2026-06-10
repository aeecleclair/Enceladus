import { AddEditVariantForm } from "./AddEditVariantForm";

import {
  AppModulesCdrSchemasCdrProductVariantBase,
  postCdrSellersSellerIdProductsProductIdVariants,
} from "@/api";
import { CustomDialog } from "@/components/common/CustomDialog";
import _variantFormSchema from "@/forms/siarnaq/variantFormSchema";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { HiPlus } from "react-icons/hi2";
import z from "zod";

import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";

interface AddingVariantCardProps {
  sellerId: string;
  productId: string;
  refreshProduct: () => void;
  isInterestProduct?: boolean;
  isMembershipProduct?: boolean;
}

export const AddingVariantCard = ({
  sellerId,
  productId,
  refreshProduct,
  isInterestProduct = false,
  isMembershipProduct = false,
}: AddingVariantCardProps) => {
  const tZod = useTranslations("siarnaq.variantFormSchema");
  const variantFormSchema = _variantFormSchema(tZod);
  const t = useTranslations("siarnaq");
  const { toast } = useToast();
  const [isAddDialogOpened, setIsAddDialogOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof variantFormSchema>>({
    resolver: zodResolver(variantFormSchema),
    mode: "onBlur",
    defaultValues: {
      price: isInterestProduct ? "0" : undefined,
      unique: isInterestProduct || isMembershipProduct ? "unique" : undefined,
      allowed_curriculum: [],
      isMembershipProduct: isMembershipProduct,
    },
  });

  async function onSubmit(values: z.infer<typeof variantFormSchema>) {
    setIsLoading(true);
    const added_duration = values.related_membership_added_duration?.match(
      /^P?((\d+Y)?(\d+M)?(\d+D)?)$/,
    );
    const body: AppModulesCdrSchemasCdrProductVariantBase = {
      ...values,
      price: isInterestProduct ? 0 : Math.round(parseFloat(values.price) * 100),
      unique: values.unique === "unique",
      enabled: true,
      related_membership_added_duration: added_duration
        ? "P" + added_duration[1]
        : undefined,
    };
    const { error } = await postCdrSellersSellerIdProductsProductIdVariants({
      path: {
        seller_id: sellerId,
        product_id: productId,
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
  return (
    <CustomDialog
      isOpened={isAddDialogOpened}
      setIsOpened={setIsAddDialogOpened}
      title={t("addingVariantCard.addingVariant")}
      description={
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <AddEditVariantForm
              form={form}
              setIsOpened={setIsAddDialogOpened}
              isLoading={isLoading}
              isInterestProduct={isInterestProduct}
              isMembershipProduct={isMembershipProduct}
            />
          </form>
        </Form>
      }
    >
      <Card className={`min-w-40 min-h-20 h-full`}>
        <CardContent className="flex flex-col items-center justify-center m-auto h-full p-0 cursor-pointer">
          <HiPlus className="w-8 h-8" />
        </CardContent>
      </Card>
    </CustomDialog>
  );
};
