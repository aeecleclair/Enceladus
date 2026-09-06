"use client";

import { useAuth } from "@/app/authContext";
import { LoadingButton } from "@/components/common/LoadingButton";
import { WarningDialog } from "@/components/common/WarningDialog";
import { UserShell } from "@/components/raid/home/UserShell";
import { VolunteerPaymentButton } from "@/components/raid/home/volunteerView/VolunteerPaymentButton";
import {
  VolunteerFormSchema,
  volunteerFormSchema,
} from "@/forms/raid/volunteer";
import { useMeVolunteer } from "@/hooks/raid/useMeVolunteer";
import { useRouter } from "@/i18n/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { HeartHandshake } from "lucide-react";
import PhoneInput from "react-phone-input-2";

const DEFAULT_VALUES: VolunteerFormSchema = {
  diet: "",
  allergy: "",
  emergency_person_name: "",
  emergency_person_phone: "",
  has_car: false,
  car_seats: undefined,
  is_special_driver: false,
  is_utility_vehicle_driver: false,
  is_parcours_helper: false,
};

const VolunteerPage = () => {
  const { isTokenQueried, token } = useAuth();
  const {
    meVolunteer,
    isLoading,
    updateMeVolunteer,
    isUpdateLoading,
    cancelMeVolunteer,
    isCancelLoading,
  } = useMeVolunteer();
  const router = useRouter();
  const [isCancelAlertOpen, setIsCancelAlertOpen] = useState(false);
  const t = useTranslations("raid.volunteer.page");
  const tr = useTranslations("raid.volunteer.register");
  const td = useTranslations("raid.volunteer.dashboard");
  const tc = useTranslations("raid.common");

  const form = useForm<VolunteerFormSchema>({
    resolver: zodResolver(volunteerFormSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onSubmit",
  });
  // eslint-disable-next-line react-hooks/incompatible-library
  const hasCar = form.watch("has_car");

  useEffect(() => {
    if (isTokenQueried && token === null) {
      router.replace("/login");
    }
  }, [isTokenQueried, token, router]);

  useEffect(() => {
    if (!isLoading && !meVolunteer) {
      router.replace("/volunteer-register");
    }
  }, [isLoading, meVolunteer, router]);

  useEffect(() => {
    if (meVolunteer) {
      form.reset({
        diet: meVolunteer.diet ?? "",
        allergy: meVolunteer.allergy ?? "",
        emergency_person_name: meVolunteer.emergency_person_name ?? "",
        emergency_person_phone: meVolunteer.emergency_person_phone ?? "",
        has_car: meVolunteer.has_car ?? false,
        car_seats: meVolunteer.car_seats ?? undefined,
        is_special_driver: meVolunteer.is_special_driver ?? false,
        is_utility_vehicle_driver:
          meVolunteer.is_utility_vehicle_driver ?? false,
        is_parcours_helper: meVolunteer.is_parcours_helper ?? false,
      });
    }
  }, [meVolunteer, form]);

  const status = meVolunteer?.cancelled
    ? { label: td("cancelled"), variant: "destructive" as const }
    : meVolunteer?.validated
      ? { label: td("validated"), variant: "default" as const }
      : { label: td("pending"), variant: "secondary" as const };

  const onSubmit = (values: VolunteerFormSchema) => {
    updateMeVolunteer({
      diet: values.diet || null,
      allergy: values.allergy || null,
      emergency_person_name: values.emergency_person_name || null,
      emergency_person_phone: values.emergency_person_phone || null,
      has_car: values.has_car,
      car_seats: values.has_car ? (values.car_seats ?? null) : null,
      is_special_driver: values.is_special_driver,
      is_utility_vehicle_driver: values.is_utility_vehicle_driver,
      is_parcours_helper: values.is_parcours_helper,
    });
  };

  return (
    <UserShell>
      <main className="mx-auto w-full space-y-5 py-4 sm:py-5">
        <section className="rounded-2xl border border-border/70 bg-card/85 p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-700 dark:text-orange-400">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                {t("title")}
              </h1>
              <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
            </div>
          </div>
        </section>
        <Card className="mx-auto w-full max-w-3xl border-border/70 bg-card/95 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t("inscriptionTitle")}</CardTitle>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
            <CardDescription>
              {meVolunteer?.cancelled
                ? t("cardCancelled")
                : meVolunteer?.validated
                  ? t("cardValidated")
                  : t("cardPending")}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="mx-auto w-full max-w-3xl border-border/70 bg-card/95 shadow-sm">
          <CardHeader>
            <CardTitle>{t("informationTitle")}</CardTitle>
            <CardDescription>{t("informationSubtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end mb-4">
              <VolunteerPaymentButton />
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="diet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tr("diet")}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={t("dietPlaceholder")} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="allergy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tr("allergy")}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t("allergyPlaceholder")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {(!form.watch("emergency_person_name") ||
                  !form.watch("emergency_person_phone")) && (
                  <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-300">
                    {t("emergencyContactRequired")}
                  </div>
                )}
                <div className="grid gap-3 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="emergency_person_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{tr("emergencyPersonName")}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={t("emergencyPersonNamePlaceholder")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emergency_person_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{tr("emergencyPersonPhone")}</FormLabel>
                        <FormControl>
                          <PhoneInput
                            country={"fr"}
                            specialLabel=""
                            placeholder={t("emergencyPersonPhonePlaceholder")}
                            inputClass="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            dropdownClass="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="has_car"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(v) => field.onChange(v === true)}
                        />
                      </FormControl>
                      <FormLabel className="mt-0!">{tr("hasCar")}</FormLabel>
                    </FormItem>
                  )}
                />
                {hasCar && (
                  <FormField
                    control={form.control}
                    name="car_seats"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{tr("carSeats")}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value),
                              )
                            }
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="is_special_driver"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(v) => field.onChange(v === true)}
                        />
                      </FormControl>
                      <FormLabel className="mt-0!">
                        {tr("isSpecialDriver")}
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_utility_vehicle_driver"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(v) => field.onChange(v === true)}
                        />
                      </FormControl>
                      <FormLabel className="mt-0!">
                        {tr("isUtilityVehicleDriver")}
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_parcours_helper"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(v) => field.onChange(v === true)}
                        />
                      </FormControl>
                      <FormLabel className="mt-0!">
                        {tr("isParcoursHelper")}
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <div className="flex gap-3 pt-2">
                  <LoadingButton
                    type="submit"
                    isLoading={isUpdateLoading}
                    className="flex-1"
                    disabled={!!meVolunteer?.cancelled}
                  >
                    {t("save")}
                  </LoadingButton>
                  {!meVolunteer?.cancelled && (
                    <>
                      <LoadingButton
                        type="button"
                        isLoading={isCancelLoading}
                        onClick={() => setIsCancelAlertOpen(true)}
                        variant="destructive"
                      >
                        {t("unregister")}
                      </LoadingButton>
                      <WarningDialog
                        isOpened={isCancelAlertOpen}
                        setIsOpened={setIsCancelAlertOpen}
                        isLoading={isCancelLoading}
                        title={t("unregisterTitle")}
                        description={t("unregisterDescription")}
                        validateLabel={tc("confirm")}
                        callback={() => cancelMeVolunteer()}
                        width="w-35"
                      />
                    </>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </UserShell>
  );
};

export default VolunteerPage;
