import { OfferBase } from "@/api";
import { DatePicker } from "@/components/common/DatePicker";
import { LoadingButton } from "@/components/common/LoadingButton";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import _offerFormSchema from "@/forms/pmf/offerFormSchema";
import { useOffers } from "@/hooks/pmf/useOffers";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export const AddOfferButton = () => {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("pmf");
  const offerFormSchema = _offerFormSchema()
  const { postOffer } = useOffers();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { userId } = useAuth();
  const form = useForm<z.infer<typeof offerFormSchema>>({
    resolver: zodResolver(offerFormSchema),
    mode: "onBlur",
    defaultValues: { author_id: userId || "", company_name: "", title: "", description: "", offer_type: "TFE", location: "", location_type: "On_site", duration: 6 },
  })
  async function onSubmit(values: z.infer<typeof offerFormSchema>) {
    setIsLoading(true);
    const body: OfferBase = {
      ...values,
      start_date: values.start_date.setUTCHours(24, 0, 0, 0).toString(),
    };
    postOffer(body, () => {
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
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <label className="mb-2 block text-sm font-medium">
                  {t("addOfferButton.offerTitle")}
                </label>
                <FormControl>
                  <textarea
                    {...field}
                    rows={1}
                    className="w-full resize-none overflow-hidden border border-color-border px-4 py-3 rounded-lg shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder={t("addOfferButton.offerTitle")}
                    onInput={(event) => {
                      const target = event.currentTarget;
                      target.style.height = "auto";
                      target.style.height = `${target.scrollHeight}px`;
                    }}
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
                  <textarea
                    {...field}
                    rows={1}
                    className="w-full  resize-none overflow-hidden rounded-lg border border-color-border px-4 py-3 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder={t("addOfferButton.offerCompanyName")}
                    onInput={(event) => {
                      const target = event.currentTarget;
                      target.style.height = "auto";
                      target.style.height = `${target.scrollHeight}px`;
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <label className="mb-2 block text-sm font-medium">
                  {t("addOfferButton.offerDescription")}
                </label>
                <FormControl>
                  <textarea
                    {...field}
                    rows={4}
                    className="w-full resize-none overflow-hidden border rounded-lg border-color-border px-4 py-3 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder={t("addOfferButton.offerDescription")}
                    onInput={(event) => {
                      const target = event.currentTarget;
                      target.style.height = "auto";
                      target.style.height = `${target.scrollHeight}px`;
                    }}
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
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="flex h-12 w-full items-center justify-between border border-color-border px-4 text-left rounded-lg shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {offerFormSchema.shape.offer_type.options.map((oType: string) => (
                          <SelectItem key={oType} value={oType}>
                            <span>{oType}{oType === "TFE" ? t("addOfferButton.offerTypeTFE") : oType === "APP" ? t("addOfferButton.offerTypeAPP") : oType === "EXE" ? t("addOfferButton.offerTypeEXE") : ""}</span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location_type"
              render={({ field }) => (
                <FormItem className="w-full">
                  <label className="mb-2 block text-sm font-medium">
                    {t("addOfferButton.locationType")}
                  </label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="flex h-12 w-full items-center justify-between border border-color-border px-4 text-left rounded-lg shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {offerFormSchema.shape.location_type.options.map((lType: string) => (
                          <SelectItem key={lType} value={lType}>
                            <span>{lType}</span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="w-full">
                <label className="mb-2 block text-sm font-medium">
                  {t("addOfferButton.offerLocation")}
                </label>
                <FormControl>
                  <textarea
                    {...field}
                    rows={1}
                    className="w-full overflow-hidden resize-none rounded-lg border border-color-border px-4 py-3 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder={t("addOfferButton.offerLocation")}
                    onInput={(event) => {
                      const target = event.currentTarget;
                      target.style.height = "auto";
                      target.style.height = `${target.scrollHeight}px`;
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
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
              {t("addOfferButton.add")}
            </LoadingButton>
          </div>
        </form>
      </div>
    </Form>
  )
};
