import { CardTemplate } from "./CardTemplate"
import { StyledFormField } from "@/components/siarnaq/custom/StyledFormField";
import { Input } from "@/components/ui/input";

import z from "zod";
import _categoryFormSchema from "@/forms/sg/categoryFormSchema";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import type { StagedSession } from "./AddEditEventForm";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from "@/components/ui/combobox"
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
                            <Combobox
                                items={sessions.map((s) => s.id)}
                                multiple
                                value={field.value || []}
                                onValueChange={field.onChange}
                                >
                                <ComboboxChips>
                                    <ComboboxValue>
                                    {(field.value || []).map((id:string) => {
                                        const session = sessions.find((s) => s.id === id);
                                        return (
                                            <ComboboxChip key={id}>
                                            {session ? session.name : id}
                                            </ComboboxChip>
                                        );
                                    })}
                                    </ComboboxValue>
                                    <ComboboxChipsInput placeholder={t("addSession")} />
                                </ComboboxChips>
                                <ComboboxContent>
                                    <ComboboxEmpty>No Sessions found.</ComboboxEmpty>
                                    <ComboboxList>
                                    {(id) => {
                                        const session = sessions.find((s) => s.id === id);
                                        return (
                                            <ComboboxItem key={id} value={id}>
                                                {session ? session.name : id}
                                            </ComboboxItem>
                                        );
                                    }}
                                    </ComboboxList>
                                </ComboboxContent>
                                </Combobox>
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
                    input={(field) => <Input {...field} type="number" placeholder={t("unlimited")} onChange={(e) => field.onChange(e.target.valueAsNumber)} />}
                    />
                    <StyledFormField
                    form={form}
                    label={t("user_quota") + " " +  t("optional")}
                    id="user_quota"
                    input={(field) => <Input {...field} type="number" placeholder={t("unlimited")} onChange={(e) => field.onChange(e.target.valueAsNumber)} />}
                    />

                </div>
                {children}
            </div>
        </CardTemplate>
    )
}