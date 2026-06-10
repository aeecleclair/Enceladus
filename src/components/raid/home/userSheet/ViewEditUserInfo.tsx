import { EditUserInfoField } from "./EditUserInfoField";
import { UserInfoView } from "./UserInfoView";

import { Participant, RaidParticipant, RaidParticipantUpdate } from "@/api";
import { DatePicker } from "@/components/common/DatePicker";
import { useMeParticipant } from "@/hooks/raid/useMeParticipant";
import { useMeTeam } from "@/hooks/raid/useMeTeam";
import { apiFormatDate, formatDate } from "@/lib/dateFormat";

import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { HiCheck, HiPencil, HiX } from "react-icons/hi";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { SheetFooter } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";

import { addYears, toDate } from "date-fns";
import PhoneInput from "react-phone-input-2";

interface UserButtonProps {
  me: RaidParticipant;
  isEdit: boolean;
  setIsEdit: (value: boolean) => void;
  setIsOpen: (value: boolean) => void;
}

export const ViewEditUserInfo = ({
  me,
  isEdit,
  setIsEdit,
  setIsOpen,
}: UserButtonProps) => {
  const { refetchTeam } = useMeTeam();
  const { toast } = useToast();
  const { updateParticipant, isUpdateLoading } = useMeParticipant();

  const formSchema = z.object({
    firstname: z.string().min(1, {
      message: "Veuillez renseigner votre prénom",
    }),
    name: z.string().min(1, {
      message: "Veuillez renseigner votre nom",
    }),
    email: z.string().email({
      message: "Veuillez renseigner une adresse email valide",
    }),
    phone: z
      .string({
        error: "Veuillez renseigner un numéro de téléphone",
      })
      .min(10, {
        message: "Veuillez renseigner un numéro de téléphone valide",
      })
      .max(14, {
        message: "Veuillez renseigner un numéro de téléphone valide",
      }),
    birthday: z.date({
      error: "Veuillez renseigner votre date de naissance",
    }),
  });

  function getPhone(value?: string): string {
    if (!value) {
      return "";
    }
    if (value.startsWith("0")) {
      return `+33 ${value.slice(1)}`;
    }
    return value;
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: me?.firstname,
      name: me?.name,
      email: me?.email,
      phone: getPhone(me?.phone ?? ""),
      birthday: me?.birthday ? toDate(me?.birthday) : undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!form.formState.isDirty) {
      setIsEdit(!isEdit);
      return;
    }
    const dateString = apiFormatDate(values.birthday);
    const updatedParticipant: RaidParticipantUpdate = {
      ...values,
      birthday: dateString,
    };
    updateParticipant(updatedParticipant, me.id, () => {
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès",
      });
      refetchTeam();
      setIsEdit(!isEdit);
      setIsOpen(false);
      form.reset({
        firstname: values?.firstname,
        name: values?.name,
        email: values?.email,
        phone: getPhone(values?.phone ?? ""),
        birthday: values?.birthday ? toDate(values?.birthday) : undefined,
      });
    });
  }

  function toggle() {
    if ((isEdit && form.formState.isDirty) || !isEdit) {
      setIsEdit(!isEdit);
    }
  }

  return (
    <div className="h-full">
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col justify-between h-full"
        >
          <div></div>
          {isEdit ? (
            <div className="grid w-full items-center gap-6">
              <EditUserInfoField
                form={form}
                label="Prénom"
                id="firstname"
                placeholder="Prénom"
              />
              <EditUserInfoField
                form={form}
                label="Nom"
                id="name"
                placeholder="Nom"
              />
              <EditUserInfoField
                form={form}
                label="Email"
                id="email"
                placeholder="inscription@raid.fr"
              />
              <FormField
                control={form.control}
                name="phone"
                render={() => (
                  <FormItem>
                    <div className="flex flex-col space-y-1.5">
                      <FormLabel className="text-left font-bold">
                        Téléphone :
                      </FormLabel>
                      <div className="col-span-4">
                        <FormMessage />
                        <Controller
                          name="phone"
                          control={form.control}
                          render={({ field: { onChange, value } }) => (
                            <PhoneInput
                              value={value}
                              onChange={onChange}
                              country={"fr"}
                              specialLabel=""
                              placeholder="+33 6 06 06 06 06"
                              inputClass="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              dropdownClass="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                            />
                          )}
                        />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthday"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col space-y-1.5">
                      <FormLabel className="text-left font-bold">
                        Date de naissance :
                      </FormLabel>
                      <div className="col-span-4">
                        <FormMessage />
                        <Controller
                          name="birthday"
                          control={form.control}
                          render={({ field: { onChange, value } }) => (
                            <DatePicker
                              date={value}
                              setDate={onChange}
                              defaultDate={value || addYears(new Date(), -21)}
                              {...field}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          ) : (
            <div className="grid w-full items-center gap-10">
              <UserInfoView label="Prénom" value={me?.firstname} />
              <UserInfoView label="Nom" value={me?.name} />
              <UserInfoView label="Email" value={me?.email} />
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="phone" className="font-bold">
                  Téléphone :
                </Label>
                <PhoneInput
                  value={me?.phone}
                  country={"fr"}
                  specialLabel=""
                  inputClass="bg-transparent"
                  disabled
                />
              </div>
              <UserInfoView
                label="Date de naissance"
                value={
                  me?.birthday ? formatDate(me!.birthday) : "Non renseigné"
                }
              />
            </div>
          )}
          <SheetFooter className="mt-8">
            <div className="flex flex-row justify-between items-center w-full gap-6">
              {isEdit ? (
                <>
                  {isUpdateLoading ? (
                    <Button variant="default" disabled className="w-full">
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      type="submit"
                      disabled={!form.formState.isDirty}
                    >
                      <HiCheck className="mr-2 h-4 w-4" />
                      Enregistrer
                    </Button>
                  )}
                </>
              ) : (
                <>
                  {me && (
                    <Button
                      variant="outline"
                      onClick={toggle}
                      className="w-full"
                    >
                      <HiPencil className="mr-2 h-4 w-4" />
                      Éditer
                    </Button>
                  )}
                </>
              )}
              {isEdit && (
                <Button
                  variant="destructive"
                  onClick={() => form.reset()}
                  className="w-full"
                >
                  <HiX className="mr-2 h-4 w-4" />
                  Annuler
                </Button>
              )}
            </div>
          </SheetFooter>
        </form>
      </FormProvider>
    </div>
  );
};
