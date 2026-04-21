import { ReloadIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import Image from "next/image";

import { Button } from "@/components/ui/button";

interface HelloAssoButtonProps {
  isLoading: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const HelloAssoButton = ({
  isLoading,
  onClick,
}: HelloAssoButtonProps) => {
  const t = useTranslations("common");
  return (
    <Button
      className="border-[#3d33a6] group-hover:border-[#3d33a6] p-0 group pl-2"
      variant="outline"
      disabled={isLoading}
      onClick={onClick}
    >
      <Image
        src="https://api.helloasso.com/v5/img/logo-ha.svg"
        alt=""
        width={24}
        height={24}
      />
      <span className="text-white bg-[#4C40CF] group-hover:bg-[#3d33a6] h-full justify-center flex items-center rounded-r-sm w-41.25">
        {isLoading ? (
          <ReloadIcon className="h-4 w-4 animate-spin" />
        ) : (
          t.rich("HelloAssoButton.payWithHA", {
            ha: (chunks) => <span className="font-bold ml-1">{chunks}</span>,
          })
        )}
      </span>
    </Button>
  );
};
