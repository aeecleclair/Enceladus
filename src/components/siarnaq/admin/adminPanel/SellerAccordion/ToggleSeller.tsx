import {
  CoreGroupSimple,
  SellerBase,
  SellerComplete,
  deleteCdrSellersSellerId,
  patchCdrSellersSellerId,
  postCdrSellers,
} from "@/api";
import { LoadingButton } from "@/components/common/LoadingButton";
import { useSellers } from "@/hooks/siarnaq/useSellers";
import { useGroups } from "@/hooks/useGroups";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { HiPlus, HiTrash } from "react-icons/hi2";

import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface ToggleSellerProps {
  group: CoreGroupSimple;
  sellers: SellerComplete[];
}

export const ToggleSeller = ({ group, sellers }: ToggleSellerProps) => {
  const t = useTranslations("siarnaq");
  const { toast } = useToast();
  const { refetch: refetchGroups } = useGroups();
  const { refetch: refetchSellers } = useSellers();
  const [isLoading, setIsLoading] = useState(false);
  const [sellerInputValue, setSellerInputValue] = useState<string>("");
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sellerIdRef = useRef<string | null>(null);
  const sellerGroupsIds = sellers.map((seller) => seller.group_id);

  const callbacksRef = useRef({ toast, refetchGroups, refetchSellers });
  useEffect(() => {
    callbacksRef.current = { toast, refetchGroups, refetchSellers };
  });

  useEffect(() => {
    const seller = sellers.find((s) => s.group_id === group.id);
    if (seller) sellerIdRef.current = seller.id;
  }, [sellers, group.id]);

  useEffect(() => {
    if (sellerInputValue === "") return;

    if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);

    idleTimeoutRef.current = setTimeout(async () => {
      if (!sellerIdRef.current) return;

      setIsLoading(true);
      const { error } = await patchCdrSellersSellerId({
        path: { seller_id: sellerIdRef.current },
        body: { name: sellerInputValue },
      });

      const { toast, refetchGroups, refetchSellers } = callbacksRef.current;

      if (error) {
        toast({ description: error.detail, variant: "destructive" });
        setIsLoading(false);
        return;
      }
      await Promise.all([refetchGroups(), refetchSellers()]);
      setIsLoading(false);
      setSellerInputValue("");
    }, 1000);

    return () => {
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };
  }, [sellerInputValue]);

  async function createSeller(group: CoreGroupSimple) {
    setIsLoading(true);
    const body: SellerBase = {
      group_id: group.id,
      name: group.name,
      order: sellers.length + 1,
    };
    const { error } = await postCdrSellers({
      body: body,
    });
    if (error) {
      toast({
        description: error.detail,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    refetchGroups();
    refetchSellers();
    setIsLoading(false);
  }

  async function deleteSeller(groupId: string) {
    setIsLoading(true);
    const { error } = await deleteCdrSellersSellerId({
      path: { seller_id: groupId },
    });
    if (error) {
      toast({
        description: error.detail,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    refetchGroups();
    refetchSellers();
    setIsLoading(false);
  }

  return (
    <div key={group.id} className="flex flex-row items-center gap-2">
      {sellerGroupsIds.includes(group.id) ? (
        <LoadingButton
          size="icon"
          variant="destructive"
          className="h-8"
          isLoading={isLoading}
          onClick={() =>
            deleteSeller(
              sellers.find((seller) => seller.group_id === group.id)!.id,
            )
          }
        >
          <HiTrash className="w-5 h-5" />
        </LoadingButton>
      ) : (
        <LoadingButton
          variant="outline"
          size="icon"
          className="h-8"
          isLoading={isLoading}
          onClick={() => createSeller(group)}
        >
          <HiPlus className="w-5 h-5" />
        </LoadingButton>
      )}
      <span>{group.name}</span>
      {sellerGroupsIds.includes(group.id) && (
        <Input
          placeholder={t("sellerAccordionItem.sellerName")}
          value={
            sellerInputValue ||
            sellers.find((seller) => seller.group_id === group.id)?.name ||
            ""
          }
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setSellerInputValue(event.target.value)
          }
          className="h-8 w-37.5 lg:w-62.5"
        />
      )}
    </div>
  );
};
