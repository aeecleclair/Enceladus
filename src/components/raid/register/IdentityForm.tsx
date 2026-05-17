"use client";

import { LoadingButton } from "@/components/common/LoadingButton";
import { PhoneCustomInput } from "@/components/common/PhoneCustomInput";
import { DatePicker } from "@/components/common/DatePicker";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMeUser } from "@/hooks/useMeUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { addYears, toDate } from "date-fns";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const identitySchema = z.object({
  phone: z
    .string({ error: "Veuillez renseigner un numéro de téléphone" })
    .min(8, "Veuillez renseigner un numéro de téléphone valide"),
  birthday: z.date({ error: "Veuillez renseigner votre date de naissance" }),
});

type IdentityValues = z.infer<typeof identitySchema>;

interface IdentityFormProps {
  onComplete: () => void;
  submitLabel?: string;
}

export const IdentityForm = ({
  onComplete,
  submitLabel = "Continuer",
}: IdentityFormProps) => {
  const { user, updateUser, isUpdateLoading } = useMeUser();

  const form = useForm<IdentityValues>({
    resolver: zodResolver(identitySchema),
    defaultValues: {
      phone: user?.phone ?? "",
      birthday: user?.birthday ? toDate(user.birthday) : undefined,
    },
  });

  const onSubmit = (values: IdentityValues) => {
    const phone = values.phone.startsWith("+")
      ? values.phone
      : `+${values.phone}`;
    updateUser(
      {
        phone,
        birthday: values.birthday.toISOString().slice(0, 10),
      },
      () => onComplete(),
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <FormLabel>Prénom</FormLabel>
            <Input value={user?.firstname ?? ""} disabled />
          </div>
          <div className="space-y-1">
            <FormLabel>Nom</FormLabel>
            <Input value={user?.name ?? ""} disabled />
          </div>
        </div>
        <div className="space-y-1">
          <FormLabel>Email</FormLabel>
          <Input value={user?.email ?? ""} disabled />
          <FormDescription>
            Prénom, nom et email proviennent de MyECL et ne peuvent être
            modifiés qu&apos;à partir de votre compte MyECL.
          </FormDescription>
        </div>
        <FormField
          control={form.control}
          name="phone"
          render={() => (
            <FormItem>
              <FormLabel>Téléphone</FormLabel>
              <FormControl>
                <Controller
                  name="phone"
                  control={form.control}
                  render={({ field: { onChange, value } }) => (
                    <PhoneCustomInput value={value} onChange={onChange} />
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthday"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date de naissance</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                  defaultDate={field.value ?? addYears(new Date(), -21)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          isLoading={isUpdateLoading}
          type="submit"
          className="w-full"
        >
          {submitLabel}
        </LoadingButton>
      </form>
    </Form>
  );
};
