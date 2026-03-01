import {
  AppModulesTicketingSchemasTicketingEventBase,
  CustomDataFieldBase,
  GenerateTicketBase,
  deleteCdrSellersSellerIdProductsProductIdDataFieldId,
  deleteCdrSellersSellerIdProductsProductIdTicketsTicketGeneratorId,
  getTicketingEvents,
  postCdrSellersSellerIdProductsProductIdData,
  postCdrSellersSellerIdProductsProductIdTickets,
  postTicketingEvents,
} from "@/api";
import { LoadingButton } from "@/components/common/LoadingButton";
import { MultiSelect } from "@/components/siarnaq/custom/MultiSelect";
import { StyledFormField } from "@/components/siarnaq/custom/StyledFormField";
import _eventFormSchema from "@/forms/sg/eventFormSchema";
import { useMemberships } from "@/hooks/siarnaq/useMemberships";
import { useProducts } from "@/hooks/siarnaq/useProducts";
import { useSellerProductData } from "@/hooks/siarnaq/useSellerProductData";
import { useSellers } from "@/hooks/siarnaq/useSellers";

import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { HiTrash } from "react-icons/hi";
import z from "zod";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useHasCdrPermission } from "@/hooks/siarnaq/useHasCdrPermission";
import { DatePicker } from "@/components/common/DatePicker";
import { useHasTicketingPermission } from "@/hooks/sg/useHasTicketingPermission";

interface AddEditEventFormProps {
  form: UseFormReturn<z.infer<ReturnType<typeof _eventFormSchema>>>;
  isLoading: boolean;
  setIsOpened: (value: boolean) => void;
  isEdit?: boolean;
  creatorId: string;
  eventId?: string;
}

export const AddEditEventForm = ({
  form,
  isLoading,
  setIsOpened,
  creatorId,
  eventId,
  isEdit = false,
}: AddEditEventFormProps) => {
  const t = useTranslations("sg");
  const { toast } = useToast();
  const { sellers } = useSellers();
  const { data, refetch } = useSellerProductData(creatorId, eventId ?? null);
  const { memberships } = useMemberships();
  const [isAddingLoading, setIsAddingLoading] = useState(false);
  const { isTicketingAdmin } = useHasTicketingPermission();

  function closeDialog(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    setIsOpened(false);
  }

  async function onAddData() {
    const data = form.getValues("data_field_name");
    if (!data) return;

    if (isEdit) {
      setIsAddingLoading(true);

      const body: AppModulesTicketingSchemasTicketingEventBase = {
        store_id: data?.store_id || "",
        name: data.name || "",
        open_date: data.open_date ? new Date(data.open_date).toISOString() : new Date().toISOString(),
        close_date: data.close_date ? new Date(data.close_date).toISOString() : new Date().toISOString(),
      };


      const {  error } = await postTicketingEvents({
        body: body,
      });
      if (error) {
        toast({
          description: error.detail,
          variant: "destructive",
        });
        setIsAddingLoading(false);
        return;
      }
      refetch();
      setIsAddingLoading(false);
    } else {
    }
  }
  

  return (
    <div className="grid gap-6 mt-4">
      <div className="flex flex-row gap-2 w-full">
        <StyledFormField
          form={form}
          label={t("addEditProductForm.name_fr")}
          id="name_fr"
          input={(field) => <Input {...field} />}
        />
      </div>
      <div className="flex flex-row gap-2">
        <StyledFormField
          form={form}
          label={t("addEditProductForm.user_quota")}
          id="user_quota"
          input={(field) => <Input {...field} type="number" onChange={(e) => field.onChange(e.target.valueAsNumber)} />}
        />
      </div>
      <div className="flex flex-row gap-2">
        <StyledFormField
          form={form}
          label={t("addEditProductForm.start_date")}
          id="start_date"
          input={(field) => (
            <DatePicker
              date={field.value}
              setDate={field.onChange}
              fromMonth={new Date(new Date().getFullYear(), 0)}
              defaultDate={field.value || new Date()}
            />
          )}
        />
      </div>
      <div className="flex flex-row gap-2">
        <StyledFormField
          form={form}
          label={t("addEditProductForm.close_date")}
          id="close_date"
          input={(field) => (
            <DatePicker
              date={field.value}
              setDate={field.onChange}
              fromMonth={new Date(new Date().getFullYear(), 0)}
              defaultDate={field.value || new Date()}
            />
          )}
        />
      </div>
      <div className="flex justify-end mt-2 space-x-4">
        <Button
          variant="outline"
          onClick={closeDialog}
          disabled={isLoading}
          className="w-25"
        >
          {t("addEditProductForm.cancel")}
        </Button>
        <LoadingButton isLoading={isLoading} className="w-25" type="submit">
          {isEdit ? t("addEditProductForm.edit") : t("addEditProductForm.add")}
        </LoadingButton>
      </div>
    </div>
  );
};
