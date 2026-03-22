import { CardTemplate } from "./CardTemplate"
import { StyledFormField } from "@/components/siarnaq/custom/StyledFormField";
import { Input } from "@/components/ui/input";

import z from "zod";
import _categoryFormSchema from "@/forms/sg/categoryFormSchema";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { DatePicker } from "@/components/common/DatePicker";
import type { ReactNode } from "react";
import type { StagedSession } from "./AddEditEventForm";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PriceInput } from "@/components/ui/priceInput";

interface CategoryCardProps {
    form: UseFormReturn<z.infer<ReturnType<typeof _categoryFormSchema>>>;
    children?: ReactNode;
    sessions: StagedSession[];
}
export const CategoryCard = ({
    form,
    children,
    sessions,
}: CategoryCardProps) => {
    const t = useTranslations("sg.addEditCategoryForm");
    return (
        <CardTemplate>
            <div className="grid gap-6 mt-4 px-3">
                <div className="flex flex-row gap-2 w-full">
                    <StyledFormField
                    form={form}
                    label="Linked sessions"
                    id="linked_sessions"
                    input={(field) => (
                        <Select
                            value={Array.isArray(field.value) ? field.value[0] : undefined}
                            onValueChange={(value) => field.onChange(value ? [value] : [])}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a session" />
                            </SelectTrigger>
                            <SelectContent>
                                {sessions.map((session) => (
                                    <SelectItem key={session.id} value={session.id}>
                                        {session.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    />
                </div>
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
                        label={t("price")}
                        id="price"
                        input={(field) => (
                            <PriceInput
                                {...field}
                                onChange={(value) =>
                                    field.onChange(
                                        value === undefined || value === ""
                                            ? undefined
                                            : Number(value)
                                    )
                                }
                            />
                        )}
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
                {children}
            </div>
        </CardTemplate>
    )
}