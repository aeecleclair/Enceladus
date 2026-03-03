"use client";
import OffersPanel from "@/components/pmf/user/OffersPanel";
import SidePanel from "@/components/pmf/user/SidePanel";
import Footer from "@/components/common/footer";
import { useState } from "react";

export default function Page() {
  const [globalFilter, setGlobalFilter] = useState("");
  return (
    <div>
      <div className="flex gap-4">
        <div className="flex-1">
          <OffersPanel
            globalFilter={globalFilter}
          />
        </div>
        <div className="w-80">
          <SidePanel
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
