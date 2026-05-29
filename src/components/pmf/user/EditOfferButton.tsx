import { OfferBase } from "@/api";
import { DatePicker } from "@/components/common/DatePicker";
import { LoadingButton } from "@/components/common/LoadingButton";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import _offerFormSchema from "@/forms/pmf/offerFormSchema";
import { useOffer } from "@/hooks/pmf/useOffer";
import { useOffers } from "@/hooks/pmf/useOffers";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

interface EditOfferButtonProps {
  offerId: string | null;
}

export const EditOfferButton = ({ offerId }: EditOfferButtonProps) => {
  if (!offerId) return null;
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("pmf");
  const offerFormSchema = _offerFormSchema()
  const { offer, patchOffer } = useOffer(offerId);
  if (!offer || Array.isArray(offer)) return null;
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useAuth();
  const form = useForm<z.infer<typeof offerFormSchema>>({
    resolver: zodResolver(offerFormSchema),
    mode: "onBlur",
    defaultValues: { author_id: userId || "", company_name: offer.company_name || "", title: offer.title || "", description: offer.description || "", offer_type: offer.offer_type || "TFE", location: offer.location || "", location_type: offer.location_type || "On_site", duration: offer.duration || 6, start_date: offer.start_date ? new Date(offer.start_date) : new Date() },
  })
  async function onSubmit(values: z.infer<typeof offerFormSchema>) {
    setIsLoading(true);
    const body: OfferBase = {
      ...values,
      start_date: values.start_date.setUTCHours(24, 0, 0, 0).toString(),
    };
    patchOffer(body, () => {
      setIsLoading(false);
      router.push(`/`)
    });
  }
  return (
    <Form {...form}>
      <div className="max-w-3xl mx-auto border shadow-xl rounded-3xl p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">{t("addOfferButton.addOfferTitle")}</h2>
          <p className="mt-2 text-sm leading-6">
            {t("addOfferButton.addOfferDescription")}
          </p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full">
                  <label className="mb-2 block text-sm font-medium">
                    {t("addOfferButton.offerTitle")}
                  </label>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      className="w-full border border-color-border px-4 py-3 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder={t("addOfferButton.offerTitle")}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company_name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <label className="mb-2 block text-sm font-medium">
                    {t("addOfferButton.offerCompanyName")}
                  </label>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      className="w-full border border-color-border px-4 py-3 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder={t("addOfferButton.offerCompanyName")}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <label className="mb-2 block text-sm font-medium">
                  {t("addOfferButton.offerDescription")}
                </label>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    className="w-full border border-color-border px-4 py-3 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder={t("addOfferButton.offerDescription")}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="offer_type"
              render={({ field }) => (
                <FormItem className="w-full">
                  <label className="mb-2 block text-sm font-medium">
                    {t("addOfferButton.offerType")}
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex h-12 w-full items-center justify-between border px-4 text-left rounded-xl shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-200">
                      <span>{field.value || t("addOfferButton.offerType")}</span>
                      <CaretSortIcon className="size-6" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full rounded-xl border shadow-lg bg-background">
                      <DropdownMenuRadioGroup value={field.value} onValueChange={field.onChange}>
                        {offerFormSchema.shape.offer_type.options.map((oType: string) => (
                          <DropdownMenuRadioItem key={oType} value={oType} className="flex cursor-pointer justify-center rounded-xl items-center px-4 py-3 hover:bg-muted">
                            <span>{oType}</span>
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="w-full">
                  <label className="mb-2 block text-sm font-medium">
                    {t("addOfferButton.offerLocation")}
                  </label>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      className="w-full border border-color-border px-4 py-3 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder={t("addOfferButton.offerLocation")}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem className="w-full">
                <label className="mb-2 block text-sm font-medium">
                  {t("addOfferButton.date")}
                </label>
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                  fromMonth={new Date(new Date().getFullYear(), 0)}
                  defaultDate={field.value || new Date()}
                  placeholder={t("addOfferButton.date")}
                />
              </FormItem>
            )}
          />
          <div className="mt-4 flex justify-end">
            <LoadingButton
              variant="outline"
              type="submit"
              isLoading={isLoading}
              className="h-12 px-6 transition"
            >
              {t("addOfferButton.edit")}
            </LoadingButton>
          </div>
        </form>
      </div>
    </Form>
  )
};
