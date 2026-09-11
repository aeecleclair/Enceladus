import { useTranslations } from "next-intl";
import { HiPlus } from "react-icons/hi2";
import _eventFormSchema from "@/forms/sg/eventFormSchema";
import { useRouter } from "@/i18n/navigation";

interface AddEventAccordionItemProps {
    organiserId: string;
}

export const AddEventAccordionItem = ({
    organiserId,
}: AddEventAccordionItemProps) => {
    const t = useTranslations("sg.addEventDialogTitle");
    const router = useRouter();

    return (
        <div className="bg-card hover:bg-muted/50 rounded-lg p-4 shadow-sm justify-center items-center gap-2 flex flex-row w-full" onClick={() => router.push(`/admin/create?organiserId=${organiserId}`)}>
            <HiPlus className="size-4" />
            <h3 className="text-lg font-semibold">Ajouter un événement</h3>
        </div>
    );
}

