import { CardLayout } from "./CardLayout";
import { InfoValue } from "./InfoValue";

import { LoadingButton } from "@/components/common/LoadingButton";
import { usePrice } from "@/hooks/raid/usePrice";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { PriceInput } from "@/components/ui/priceInput";

export const RaidVolunteerPrice = () => {
  const { price, updatePrice } = usePrice();
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("raid.admin.information");

  const formSchema = z.object({
    volunteer_price: z.number().positive(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      volunteer_price: price?.volunteer_price
        ? price.volunteer_price / 100
        : undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    updatePrice(
      {
        ...price,
        volunteer_price: values.volunteer_price * 100,
      },
      () => {
        setIsLoading(false);
        setIsEdit(false);
        form.reset({ volunteer_price: values.volunteer_price });
      },
    );
  }

  function toggleEdit() {
    setIsEdit(!isEdit);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardLayout label={t("prices.volunteer")}>
          {isEdit ? (
            <>
              <FormField
                control={form.control}
                name="volunteer_price"
                render={({ field }) => (
                  <FormItem>
                    <div className="items-center gap-4">
                      <FormControl>
                        <PriceInput
                          onChange={(value, name, values) =>
                            field.onChange(values?.float)
                          }
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <div className="mt-3 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEdit(false)}
                  type="button"
                >
                  {t("priceEditor.cancel")}
                </Button>
                <LoadingButton size="sm" type="submit" isLoading={isLoading}>
                  {t("priceEditor.validate")}
                </LoadingButton>
              </div>
            </>
          ) : (
            <>
              <InfoValue
                isEmpty={!price?.volunteer_price}
                placeholder={t("priceEditor.noPrice")}
                value={
                  price?.volunteer_price
                    ? `${(price.volunteer_price / 100).toFixed(2)} €`
                    : ""
                }
              />
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                type="button"
                onClick={toggleEdit}
              >
                {t("priceEditor.edit")}
              </Button>
            </>
          )}
        </CardLayout>
      </form>
    </Form>
  );
};
