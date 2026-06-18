import { CardLayout } from "./CardLayout";
import { InfoValue } from "./InfoValue";

import { LoadingButton } from "@/components/common/LoadingButton";
import { usePrice } from "@/hooks/raid/usePrice";

import { zodResolver } from "@hookform/resolvers/zod";
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

export const TShirtPrice = () => {
  const { price, updatePrice } = usePrice();
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = z.object({
    t_shirt_price: z.number().positive(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      t_shirt_price: price?.t_shirt_price
        ? price.t_shirt_price / 100
        : undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    updatePrice(
      {
        ...price,
        t_shirt_price: values.t_shirt_price * 100,
      },
      () => {
        setIsLoading(false);
        setIsEdit(false);
        form.reset({ t_shirt_price: values.t_shirt_price });
      },
    );
  }

  function toggleEdit() {
    setIsEdit(!isEdit);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardLayout label="Prix du T-shirt">
          {isEdit ? (
            <>
              <FormField
                control={form.control}
                name="t_shirt_price"
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
                  Annuler
                </Button>
                <LoadingButton size="sm" type="submit" isLoading={isLoading}>
                  Valider
                </LoadingButton>
              </div>
            </>
          ) : (
            <>
              <InfoValue
                isEmpty={!price?.t_shirt_price}
                placeholder="Prix non fixé"
                value={
                  price?.t_shirt_price
                    ? `${(price.t_shirt_price / 100).toFixed(2)} €`
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
                Modifier
              </Button>
            </>
          )}
        </CardLayout>
      </form>
    </Form>
  );
};
