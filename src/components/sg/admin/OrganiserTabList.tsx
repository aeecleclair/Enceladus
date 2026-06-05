import { OrganiserComplete } from "@/api";
import { useRouter } from "@/i18n/navigation";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

interface OrganiserTabListProps {
  organisers: OrganiserComplete[];
  isAdmin?: boolean;
}

export const OrganiserTabList = ({
  organisers,
}: OrganiserTabListProps) => {
  const t = useTranslations("siarnaq");
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = (organiserId: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("organiserId", organiserId);
    const query = current.toString();
    router.push(`admin?${query}`);
  };

  return (
    <div className="flex items-center justify-between mb-4">  
      
      <Label htmlFor="search" className="sr-only">
        Search
      </Label>
      <TabsList className={`grid w-full grid-flow-row grid-cols-7`}>
        {organisers.map((organiser) => (
          <TabsTrigger
            key={organiser.id}
            value={organiser.id}
            className="min-w-18 w-full"
            onClick={() => handleClick(organiser.id)}
          >
            {organiser.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
};
