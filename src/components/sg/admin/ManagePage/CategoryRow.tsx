import { Badge } from "@/components/ui/badge";
import { CategorySimple } from "@/api";
import { useCategoryQuota } from "@/hooks/sg/useCategoryQuota";

interface CategoryRowProps {
    category: CategorySimple;
}

export function CategoryRow({ category }: CategoryRowProps) {
    const {categories: used_quota} = useCategoryQuota({ categoryId: category.id });

    return (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 text-sm">
            <div className="font-medium">{category.name}</div>
            <div className="flex flex-wrap gap-4 text-muted-foreground">
                <span>Prix : {category.price / 100} €</span>
                <span>Quota : {used_quota} / {category.quota ?? "∞"}</span>
                <span>Par utilisateur : {category.user_quota ?? "∞"}</span>
                {category.disabled && <Badge variant="destructive">Désactivée</Badge>}
            </div>
        </div>
    );
}
