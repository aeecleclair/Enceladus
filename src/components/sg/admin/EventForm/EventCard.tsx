import { StyledFormField } from "@/components/siarnaq/custom/StyledFormField";
import { Input } from "@/components/ui/input";
import { CardTemplate } from "./CardTemplate"

import z from "zod";
import _eventFormSchema from "@/forms/sg/eventFormSchema";
import { UseFormReturn } from "react-hook-form";

import { useTranslations } from "next-intl";
import { DatePicker } from "@/components/common/DatePicker";


interface EventCardProps {
    form: UseFormReturn<z.infer<ReturnType<typeof _eventFormSchema>>>;
}

export const EventCard = ({form}: EventCardProps) => {
    const t = useTranslations("sg.addEditEventForm");
    return (
        <CardTemplate>
            <div className="grid gap-6 mt-4 px-3">
                <div className="flex flex-row gap-2 w-full">
                    <StyledFormField
                    form={form}
                    label={t("name")}
                    id="name"
                    input={(field) => <Input {...field} />}
                    />
                </div>
                <div className="flex flex-row gap-2">
                    <StyledFormField
                    form={form}
                    label={t("quota") + " " +  t("optional")}
                    id="quota"
                    input={(field) => <Input {...field} type="number" placeholder={t("unlimited")} onChange={(e) => field.onChange(e.target.valueAsNumber)} />}
                    />
                    <StyledFormField
                    form={form}
                    label={t("user_quota") + " " +  t("optional")}
                    id="user_quota"
                    input={(field) => <Input {...field} type="number" placeholder={t("unlimited")} onChange={(e) => field.onChange(e.target.valueAsNumber)} />}
                    />
                </div>
                <div className="flex flex-row gap-2">
                    <StyledFormField
                    form={form}
                    label={t("start_date")}
                    id="open_date"
                    input={(field) => (
                        <DatePicker
                        date={field.value}
                        setDate={field.onChange}
                        fromMonth={new Date(new Date().getFullYear(), 0)}
                        defaultDate={field.value || new Date()}
                        withTime
                        />
                    )}
                    />
                </div>
                <div className="flex flex-row gap-2">
                    <StyledFormField
                        form={form}
                        label={t("close_date")}
                        id="close_date"
                        input={(field) => (
                            <DatePicker
                            date={field.value}
                            setDate={field.onChange}
                            fromMonth={new Date(new Date().getFullYear(), 0)}
                            defaultDate={field.value || new Date()}
                            withTime
                            />
                        )}
                    />
                </div>
                {/* <div className="flex justify-end mt-2 space-x-4 pb-4">
                    <Button
                        variant="outline"
                        onClick={closeDialog}
                        disabled={isLoading}
                        className="w-25"
                    >
                    {t("cancel")}
                    </Button>
                        <LoadingButton isLoading={isLoading} className="w-25" type="submit">
                        {isEdit ? t("edit") : t("add")}
                    </LoadingButton>
                </div> */}
            </div>
        </CardTemplate>
    );
}