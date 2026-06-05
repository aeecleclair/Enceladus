import { useTranslations } from "next-intl";
import { useState } from "react";
import { HiPlus } from "react-icons/hi2";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import _eventFormSchema from "@/forms/sg/eventFormSchema";
import z from "zod";
import { useToast } from "@/components/ui/use-toast";

import { AppModulesTicketingSchemasTicketingEventBase as TicketingEventBase } from "@/api";
import { useEvents } from "@/hooks/sg/useEvents";

import { useRouter } from "@/i18n/navigation";

interface AddEventAccordionItemProps {
    organiserId: string;
}

export const AddEventAccordionItem = ({
    organiserId,
}: AddEventAccordionItemProps) => {
    const t = useTranslations("sg.addEventDialogTitle");
    const router = useRouter();
    // const tZod =  useTranslations("sg.eventFormSchema");
    // const [isAddDialogOpened, setIsAddDialogOpened] = useState(false);
    // const [isLoading, setIsLoading] = useState(false);
    // const { toast } = useToast();

    // const { postEvent, refetch: refetchEvents } = useEvents();



    // const eventFormSchema = _eventFormSchema(tZod);
    

    // const form = useForm<z.infer<typeof eventFormSchema>>({
    //     resolver: zodResolver(eventFormSchema),
    //     mode: "onBlur",
    //     defaultValues: {
    //         name: "",
    //         open_date: new Date(),
    //         close_date: new Date(),
    //         quota: 0,
    //         user_quota: 0,
    //         organiser_id: organiserId,
    //     },
    // });

    // console.log(form, "form object with values:", form.getValues());

    // async function onSubmit(values: z.infer<typeof eventFormSchema>) {
    //     console.log("onSubmit called with values:", values);
    //     setIsLoading(true);
    //     const body: TicketingEventBase = {
    //         ...values,
    //         open_date: values.open_date.setUTCHours(24, 0, 0, 0).toString(),
    //         close_date: (values.open_date ?? new Date()).setUTCHours(24, 0, 0, 0).toString(),
    //     };

    //     console.log("Body to be sent:", body);

    //     postEvent(body, () => {
    //         console.log("✅ Event posted successfully");
    //         refetchEvents();
    //         setIsAddDialogOpened(false);
    //         setIsLoading(false);
    //         form.reset();
    //     });
    // }

    return (
        <div className="border-sidebar-accent-foreground rounded-lg mx-20 p-4 shadow-sm justify-around flex flex-row w-full" onClick={() => router.push(`/admin/create?organiserId=${organiserId}`)}>
            <HiPlus className="w-4 h-10 mr-6" />
            <h3 className="text-lg font-semibold">Ajouter un événement</h3>
            <div className="flex"></div>
        </div>
    );
}

