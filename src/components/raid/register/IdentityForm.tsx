"use client";

import { DatePicker } from "@/components/common/DatePicker";
import { LoadingButton } from "@/components/common/LoadingButton";
import { PhoneCustomInput } from "@/components/common/PhoneCustomInput";
import { useMeUser } from "@/hooks/useMeUser";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

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

import { addYears, toDate } from "date-fns";

interface IdentityValues {
  phone: string;
  birthday: Date;
}

interface IdentityFormProps {
  onComplete: () => void;
  submitLabel?: string;
}

export const IdentityForm = ({
  onComplete,
  submitLabel,
}: IdentityFormProps) => {
  const t = useTranslations("raid.register.identity");
  const { user, updateUser, isUpdateLoading } = useMeUser();

  const identitySchema = useMemo(
    () =>
      z.object({
        phone: z
          .string({ error: t("phoneRequired") })
          .min(8, t("phoneInvalid")),
        birthday: z.date({ error: t("birthdayRequired") }),
      }),
    [t],
  );

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
            <FormLabel>{t("firstname")}</FormLabel>
            <Input value={user?.firstname ?? ""} disabled />
          </div>
          <div className="space-y-1">
            <FormLabel>{t("lastname")}</FormLabel>
            <Input value={user?.name ?? ""} disabled />
          </div>
        </div>
        <div className="space-y-1">
          <FormLabel>{t("email")}</FormLabel>
          <Input value={user?.email ?? ""} disabled />
          <FormDescription>{t("emailHelp")}</FormDescription>
        </div>
        <FormField
          control={form.control}
          name="phone"
          render={() => (
            <FormItem>
              <FormLabel>{t("phone")}</FormLabel>
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
              <FormLabel>{t("birthday")}</FormLabel>
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
          {submitLabel ?? t("continue")}
        </LoadingButton>
      </form>
    </Form>
  );
};
