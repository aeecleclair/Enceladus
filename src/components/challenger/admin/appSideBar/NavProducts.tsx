"use client";
import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useProducts } from "@/hooks/challenger/useProducts";

export function NavProducts() {
  const { products } = useProducts();
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <div
          onClick={() => router.push("/admin/products")}
          className="cursor-pointer hover:underline"
        >
          Produits {(products?.length ?? 0) > 0 && `(${products!.length})`}
        </div>
      </SidebarGroupLabel>
    </SidebarGroup>
  );
}
