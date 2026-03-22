import { CustomDialog } from "@/components/common/CustomDialog"
import { useTranslations } from "next-intl";
import { useState } from "react";
import { HiPlus } from "react-icons/hi2";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import _eventFormSchema from "@/forms/sg/eventFormSchema";
import z from "zod";
import { useToast } from "@/components/ui/use-toast";

import { AppModulesTicketingSchemasTicketingEventBase as TicketingEventBase } from "@/api";
import { useEvents } from "@/hooks/sg/useEvents";

import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { AddEditEventForm } from "./EventForm/AddEditEventForm";

interface AddEventAccordionItemProps {
    organiserId: string;
    creatorId: string;
    refreshEvent: () => void;
}

export const AddEventAccordionItem = ({
    organiserId,
    creatorId,
    refreshEvent
}: AddEventAccordionItemProps) => {
    const tZod =  useTranslations("sg.eventFormSchema");
    const [isAddDialogOpened, setIsAddDialogOpened] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const { postEvent, refetch: refetchEvents } = useEvents();



    // const firstSellerId =
    //     searchParams.get("sellerId") ||
    //     sellers.at(0)?.id ||
    //     (isCdrAdmin ? "cdradmin" : "");
        
    // useEffect(() => {
    //     if (!searchParams.get("sellerId") && sellers.length > 0 && firstSellerId) {
    //         const current = new URLSearchParams(Array.from(searchParams.entries()));
    //         current.set("sellerId", firstSellerId);
    //         const query = current.toString();
    //         router.replace(`admin?${query}`);
    //     }
    // }, [firstSellerId, router, searchParams, sellers]);


    const t = useTranslations("sg.addEventDialogTitle");

    const eventFormSchema = _eventFormSchema(tZod);
    const router = useRouter();
    

    const form = useForm<z.infer<typeof eventFormSchema>>({
        resolver: zodResolver(eventFormSchema),
        mode: "onBlur",
        defaultValues: {
            name: "",
            open_date: new Date(),
            close_date: new Date(),
            quota: 0,
            user_quota: 0,
            organiser_id: organiserId,
        },
    });

    console.log(form, "form object with values:", form.getValues());

    async function onSubmit(values: z.infer<typeof eventFormSchema>) {
        console.log("onSubmit called with values:", values);
        setIsLoading(true);
        const body: TicketingEventBase = {
            ...values,
            open_date: values.open_date.setUTCHours(24, 0, 0, 0).toString(),
            close_date: (values.open_date ?? new Date()).setUTCHours(24, 0, 0, 0).toString(),
        };

        console.log("Body to be sent:", body);

        postEvent(body, () => {
            console.log("✅ Event posted successfully");
            refetchEvents();
            setIsAddDialogOpened(false);
            setIsLoading(false);
            form.reset();
        });
    }

    return (
        <div>
            <CustomDialog
                isFullWidth
                title={t("newEvent")}
                description={
                    <Form {...form}>
                        <form 
                            onSubmit={(e) => {
                                form.setValue("organiser_id", organiserId || "");
                                form.handleSubmit((values) => {
                                    console.log("Form submitted with values:", values);
                                    onSubmit(values);
                                })(e);
                            }}
                            >
                            <AddEditEventForm
                                form={form}
                                setIsOpened={setIsAddDialogOpened}
                                isLoading={isLoading}
                                creatorId={creatorId}
                                />
                        </form>
                    </Form>
                }
                isOpened={isAddDialogOpened}
                setIsOpened={setIsAddDialogOpened}
                >
                <div className="border-sidebar-accent-foreground rounded-lg p-4 shadow-sm">
                    <HiPlus className="w-4 h-4 mr-6" />
                    <h3 className="text-lg font-semibold mb-2">Ajouter un événement</h3>
                    <div className="flex grow"></div>
                </div>
            </CustomDialog>
            <div className="border-sidebar-accent-foreground rounded-lg p-4 shadow-sm w-full" onClick={() => router.push(`/admin/create?organiserId=${organiserId}`)}>
                <HiPlus className="w-4 h-4 mr-6" />
                <h3 className="text-lg font-semibold mb-2 ">Ajouter un événement</h3>
                <div className="flex grow"></div>
            </div>
        </div>
    );
}

