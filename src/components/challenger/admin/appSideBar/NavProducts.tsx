"use client";
import {
  SidebarGroup,
  SidebarGroupLabel,
} from "../../ui/sidebar";
import { useRouter } from "next/navigation";
import { useProducts } from "@/src/hooks/useProducts";

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
