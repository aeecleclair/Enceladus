"use client";

import { CategorySimple } from "@/api";
import { CategoryRow } from "./CategoryRow";
import { Button } from "@/components/ui/button";

interface CategoriesSectionProps {
    categories: CategorySimple[];
    onEdit?: () => void;
}

export function CategoriesSection({ categories, onEdit }: CategoriesSectionProps) {
    return (
        <section className="rounded-xl shadow-md bg-background p-6 grid gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-base font-semibold">
                    Catégories <span className="text-muted-foreground font-normal">({categories.length})</span>
                </h2>
                <Button variant="outline" size="sm" className="mt-2" onClick={onEdit}>
                    Modifier les catégories
                </Button>
            </div>
            {categories.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune catégorie.</p>
            ) : (
                <div className="grid gap-2">
                    {categories.map((category) => (
                        <CategoryRow key={category.id} category={category} />
                    ))}
                </div>
            )}
        </section>
    );
}
