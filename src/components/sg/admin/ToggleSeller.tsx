import {
  CoreGroupSimple,
  SellerBase,
  SellerComplete,
  deleteCdrSellersSellerId,
  postCdrSellers,
} from "@/api";
import { LoadingButton } from "@/components/common/LoadingButton";
import { useGroups } from "@/hooks/useGroups";
import { useSellers } from "@/hooks/siarnaq/useSellers";

import { useState } from "react";
import { HiPlus, HiTrash } from "react-icons/hi2";

import { useToast } from "@/components/ui/use-toast";

interface ToggleSellerProps {
  group: CoreGroupSimple;
  sellers: SellerComplete[];
}

export const ToggleSeller = ({ group, sellers }: ToggleSellerProps) => {
  const { toast } = useToast();
  const { refetch: refetchGroups } = useGroups();
  const { refetch: refetchSellers } = useSellers();
  const [isLoading, setIsLoading] = useState(false);
  const sellerIds = sellers.map((seller) => seller.group_id);
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
    <div key={group.id} className="flex flex-row items-center">
      {sellerIds.includes(group.id) ? (
        <LoadingButton
          size="icon"
          variant="destructive"
          className="h-8"
          isLoading={isLoading}
          onClick={() =>
            deleteSeller(
              sellers.find((seller) => seller.group_id === group.id)!.id
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
      <span className="ml-4">{group.name}</span>
    </div>
  );
};
