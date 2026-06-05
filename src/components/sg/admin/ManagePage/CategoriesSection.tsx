"use-client"

import { CategorySimple } from "@/api";
import { CategoryRow } from "./CategoryRow";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronsDownUp } from "lucide-react";
import { useState } from "react";
interface CategoriesSectionProps {
    categories: CategorySimple[];
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
    const [open, setOpen] = useState(false);
    return (
        <>
        {/* <section className="rounded-xl shadow-md bg-background p-6 grid gap-4">
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
        </section> */}
        <Collapsible key="categories" open={open} onOpenChange={setOpen} className="rounded-xl shadow-md bg-background p-6">
            <CollapsibleTrigger asChild>
                <Button variant="ghost" className="group w-full flex justify-between items-center font-semibold">
                    <div>Catégories <span className="text-muted-foreground font-normal">({categories.length})</span></div>
                    <ChevronDown className="ml-2 transition-transform group-data-[state=open]:rotate-180" />
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
                {categories.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Aucune catégorie.</p>
                ) : (
                    <div className="grid gap-2">
                        {categories.map((category) => (
                            <CategoryRow key={category.id} category={category} />
                        ))}
                    </div>
                )}
            </CollapsibleContent>
        </Collapsible>
        </>
    );
}
