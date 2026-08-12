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
        <div className="border-sidebar-accent-foreground rounded-lg mx-20 p-4 shadow-sm justify-around flex flex-row w-full" onClick={() => router.push(`/admin/create?organiserId=${organiserId}`)}>
            <HiPlus className="w-4 h-10 mr-6" />
            <h3 className="text-lg font-semibold">Ajouter un événement</h3>
            <div className="flex"></div>
        </div>
    );
}

