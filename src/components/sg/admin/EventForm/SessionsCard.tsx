import { CardTemplate } from "./CardTemplate"
import { StyledFormField } from "@/components/siarnaq/custom/StyledFormField";
import { Input } from "@/components/ui/input";

import z from "zod";
import _sessionFormSchema from "@/forms/sg/sessionFormSchema";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { DatePicker } from "@/components/common/DatePicker";
import type { ReactNode } from "react";
interface SessionCardProps {
    form: UseFormReturn<z.infer<ReturnType<typeof _sessionFormSchema>>>;
    children?: ReactNode;
    minDate?: Date;
    maxDate?: Date;
}
export const SessionCard = ({
    form,
    children,
    minDate,
    maxDate,
}: SessionCardProps) => {
    const t = useTranslations("sg.addEditSessionForm");
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
                    input={(field) => <Input {...field} type="number" onChange={(e) => field.onChange(e.target.valueAsNumber)} />}
                    />
                    <StyledFormField
                    form={form}
                    label={t("user_quota") + " " +  t("optional")}
                    id="user_quota"
                    input={(field) => <Input {...field} type="number" onChange={(e) => field.onChange(e.target.valueAsNumber)} />}
                    />
                </div>
                <div className="flex flex-row gap-2">
                    <StyledFormField
                    form={form}
                    label={t("date")}
                    id="date"
                    input={(field) => (
                        <DatePicker
                        date={field.value}
                        setDate={field.onChange}
                        fromMonth={minDate ?? new Date(new Date().getFullYear(), 0)}
                        toMonth={maxDate}
                        minDate={minDate}
                        maxDate={maxDate}
                        defaultDate={field.value || new Date()}
                        withTime
                        />
                    )}
                    />
                </div>
                {children}
            </div>
        </CardTemplate>
    )
}