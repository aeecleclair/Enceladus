"use client"

import { useSearchParams } from 'next/navigation'
import Footer from "@/components/common/Footer";
import { useTranslations } from 'next-intl';
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import _offerApplySchema from "@/forms/pmf/offerApplySchema";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup } from '@/components/ui/select'
import { useState } from 'react';
import { useMeProfile } from '@/hooks/pmf/useMeProfile';

export default function Page() {
  const searchParams = useSearchParams()
  const offerId = searchParams.get('offerId')
  const t = useTranslations("pmf");
  const offerApplySchema = _offerApplySchema()
  const [selectedType, setSelectedType] = useState<string|undefined>(undefined);
  const form = useForm<z.infer<typeof offerApplySchema>>({
    resolver: zodResolver(offerApplySchema),
    mode: "onBlur",
    defaultValues: { CV: null, motivation: "" },
  })
  const { profile } = useMeProfile()

  return (
    <div>
      <span className="text-2xl font-bold">{t("ApplyOffer.title")}</span>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((values) => console.log(values))} className="space-y-2 mt-8 mr-2">
          <FormField
            control={form.control}
            name="CV"
            render={({ field }) => (
              <FormItem className="w-full">
                <label className="block text-sm font-medium">Curriculum Vitae</label>
                <FormControl>
                  <Select
                    value={selectedType?.toString()}
                    onValueChange={setSelectedType}
                  >
                    <SelectTrigger className="w-full m-auto">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {profile.CV.map((file) => (
                          <SelectItem key={file} value={file.name()}>
                            {file.name()}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                </FormItem>
              )}
            />
            <FormField
            control={form.control}
            name="motivation"
            render={({ field }) => (
              <FormItem classname="w-full">
                <label className="block text-sm font-medium">{t("ApplyOffer.motivation")}</label>
                <FormControl>
                  <textarea
                    {...field}
                    rows={4}
                    className="w-full resize-none overflow-hidden border rounded-lg border-color-border px-4 py-3 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder={t("AppyOffer.motivation")}
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
        </form>
      </Form>
      <Footer />
    </div>
  )
}