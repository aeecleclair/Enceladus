import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import Select from 'react-select';
import { Select as Select_shadcn, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup } from '@/components/ui/select'
import { useTags } from "@/hooks/pmf/useTags";
import { useState } from "react";
import _offerSearchSchema from "@/forms/pmf/offerSearchSchema";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { LoadingButton } from "@/components/common/LoadingButton";
import { OfferComplete } from "@/api";

interface UserSearchProps {
  globalFilter: string,
}

export const OfferSearch = ({
  globalFilter,
}: UserSearchProps) => {
  const t = useTranslations("pmf");
  const { tags } = useTags();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string|undefined>(undefined);
  const offerSearchSchema = _offerSearchSchema()
  const form = useForm<z.infer<typeof offerSearchSchema>>({
    resolver: zodResolver(offerSearchSchema),
    mode: "onBlur",
    defaultValues: { search: globalFilter, offer_type: "Any", location_type: "Any", tags:[] },
  })
  async function onSubmit(values: z.infer<typeof offerSearchSchema>) {
    console.log('test')
    // setIsLoading(true);
    // const body: OfferComplete = {
    //   ...values,
    //   start_date: values.start_date.setUTCHours(24, 0, 0, 0).toString(),
    // };
    // (body, () => {
    //   setIsLoading(false);
    //   router.push(`/`)
    // });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 mt-8 mr-2">
        <span className="text-2xl font-bold">{t("OfferSearch.title")}</span>
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem className="w-full mt-4">
              <FormControl>
                <Input
                  {...field}
                  placeholder={t("OfferSearch.search")}
                  className="h-8"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({field}) => (
            <FormItem className="w-full">
                <label className="block text-sm font-medium">
                  {"Tags :"}
                </label>
                <FormControl>
                  <Select className="" isMulti options={tags.map((tag) => ({ value: tag.id, label: tag.tag }))} placeholder={t("OfferSearch.tags")} />
                </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({field}) => (
            <FormItem className="w-full">
                <label className="block text-sm font-medium">
                  {"Type :"}
                </label>
                <FormControl>
                  <Select_shadcn
                    value={selectedType?.toString()}
                    onValueChange={setSelectedType}
                  >
                    <SelectTrigger className="w-full m-auto">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {offerSearchSchema.shape.offer_type.options.map((type) => (
                          <SelectItem key={type} value={type.toString()}>
                            {type.toString()}{type === "TFE" ? t("addOfferButton.offerTypeTFE") : type === "APP" ? t("addOfferButton.offerTypeAPP") : type === "EXE" ? t("addOfferButton.offerTypeEXE") : ""}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select_shadcn>
                </FormControl>
            </FormItem>
          )}
        />
        <div className="mt-4 flex justify-end">
          <LoadingButton
            variant="outline"
            type="submit"
            isLoading={isLoading}
            className="px-6 transition"
            size="default"
          >
            {t("OfferSearch.search")}
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
};