import { OfferBase } from "@/api";
import { DatePicker } from "@/components/common/DatePicker";
import { LoadingButton } from "@/components/common/LoadingButton";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import _offerFormSchema from "@/forms/pmf/offerFormSchema";
import { useOffers } from "@/hooks/pmf/useOffers";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
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
        console.log('test')
        setIsLoading(true);
        const body: OfferBase = {
            ...values,
            start_date: values.start_date.setUTCHours(24, 0, 0, 0).toString(),
        };
        postOffer(body, () => {
            setIsLoading(false);
            router.push(`/${locale}`)
        });
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormControl>
                                <Input
                                    {...field}
                                    type="text"
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
                            <FormControl>
                                <Input
                                    {...field}
                                    type="text"
                                    placeholder={t("addOfferButton.offerCompanyName")}
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
                            <FormControl>
                                <Input
                                    {...field}
                                    type="text"
                                    placeholder={t("addOfferButton.offerDescription")}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormControl>
                                <Input
                                    {...field}
                                    type="text"
                                    placeholder={t("addOfferButton.offerLocation")}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                        <DatePicker
                            date={field.value}
                            setDate={field.onChange}
                            fromMonth={new Date(new Date().getFullYear(), 0)}
                            defaultDate={field.value || new Date()}
                        />
                    )}
                />
                <LoadingButton
                    variant="outline"
                    type="submit"
                    isLoading={isLoading}
                    className="w-[100px]"
                >
                    {t("addOfferButton.add")}
                </LoadingButton>
            </form>
        </Form>
    )
};
