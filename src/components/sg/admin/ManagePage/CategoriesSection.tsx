import { CategorySimple } from "@/api";
import { CategoryRow } from "./CategoryRow";

interface CategoriesSectionProps {
    categories: CategorySimple[];
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
    return (
        <section className="rounded-xl border bg-background p-6 grid gap-4">
            <h2 className="text-base font-semibold">
                Catégories <span className="text-muted-foreground font-normal">({categories.length})</span>
            </h2>
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
