import { CardTemplate } from "./CardTemplate"
import { StyledFormField } from "@/components/siarnaq/custom/StyledFormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import z from "zod";
import _categoryFormSchema from "@/forms/sg/categoryFormSchema";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import type { StagedCategory, StagedSession } from "./AddEditEventForm";
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

export const NEW_CATEGORY_ID = "__new__";

interface CategoriesCardProps {
    form: UseFormReturn<z.infer<ReturnType<typeof _categoryFormSchema>>>;
    categories: StagedCategory[];
    sessions: StagedSession[];
    /** Catégorie en cours d'édition, `NEW_CATEGORY_ID` pour une création, `null` si tout est replié. */
    openId: string | null;
    onOpenChange: (id: string | null) => void;
    onRemove: (categoryId: string) => void;
    error?: string | null;
    disabled?: boolean;
}

export const CategoriesCard = ({
    form,
    categories,
    sessions,
    openId,
    onOpenChange,
    onRemove,
    error,
    disabled = false,
}: CategoriesCardProps) => {
    const t = useTranslations("sg.addEditCategoryForm");

    const fields = (isEditing: boolean) => (
        <div className="grid gap-6 mt-4 px-3 pb-4">
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
                                    {(field.value || []).map((id: string) => {
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
                    label={t("quota") + " " + t("optional")}
                    id="quota"
                    input={(field) => (
                        <Input
                            {...field}
                            type="number"
                            placeholder={t("unlimited")}
                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        />
                    )}
                />
                <StyledFormField
                    form={form}
                    label={t("user_quota") + " " + t("optional")}
                    id="user_quota"
                    input={(field) => (
                        <Input
                            {...field}
                            type="number"
                            placeholder={t("unlimited")}
                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        />
                    )}
                />
            </div>
            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(null)}>
                    Annuler
                </Button>
                <Button type="submit" disabled={disabled}>
                    {isEditing ? "Enregistrer la catégorie" : "Ajouter la catégorie"}
                </Button>
            </div>
        </div>
    );

    return (
        <CardTemplate>
            <div className="flex items-center justify-between px-3">
                <p className="font-medium">Catégories</p>
                <Button
                    type="button"
                    disabled={disabled}
                    onClick={() => onOpenChange(openId === NEW_CATEGORY_ID ? null : NEW_CATEGORY_ID)}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter une catégorie
                </Button>
            </div>

            {error ? <div className="px-3 text-sm text-destructive">{error}</div> : null}

            {openId === NEW_CATEGORY_ID ? (
                <div className="rounded-md border bg-background mx-3">
                    <div className="px-3 pt-3 text-sm font-medium">Nouvelle catégorie</div>
                    {fields(false)}
                </div>
            ) : null}

            <div className="grid gap-2 px-3">
                {categories.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                        Aucune catégorie pour le moment.
                    </div>
                ) : (
                    categories.map((category) => {
                        const isOpen = openId === category.id;
                        return (
                            <Collapsible
                                key={category.id}
                                open={isOpen}
                                onOpenChange={(open) => onOpenChange(open ? category.id : null)}
                                className="rounded-md border bg-background"
                            >
                                <div className="flex items-center gap-2 p-3">
                                    <CollapsibleTrigger className="flex flex-1 items-center gap-2 text-left">
                                        <ChevronDown
                                            className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                                        />
                                        <div>
                                            <div className="font-medium">{category.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {category.price / 100} € · quota {category.quota || 0} · quota utilisateur{" "}
                                                {category.user_quota || 0}
                                            </div>
                                        </div>
                                    </CollapsibleTrigger>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        aria-label="Supprimer la catégorie"
                                        onClick={() => onRemove(category.id)}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                                <CollapsibleContent>{fields(true)}</CollapsibleContent>
                            </Collapsible>
                        );
                    })
                )}
            </div>
        </CardTemplate>
    )
}
