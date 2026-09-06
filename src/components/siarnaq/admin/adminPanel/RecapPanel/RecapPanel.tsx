import { MigrateUserForm } from "./MigrateUserForm";
import { PaymentQrButton } from "./PaymentQrButton";

import {
  CdrUser,
  CdrUserUpdate,
  patchCdrUsersUserId,
  patchCdrUsersUserIdCurriculumsCurriculumId,
  postCdrUsersUserIdCurriculumsCurriculumId,
} from "@/api";
import { CustomDialog } from "@/components/common/CustomDialog";
import { LoadingButton } from "@/components/common/LoadingButton";
import { MembershipRecap } from "@/components/siarnaq/custom/MembershipRecap";
import { PaymentPart } from "@/components/siarnaq/custom/Payment/PaymentPart";
import { ProductPart } from "@/components/siarnaq/custom/Product/ProductPart";
import { TextSeparator } from "@/components/siarnaq/custom/TextSeparator";
import UserDisplayName from "@/components/siarnaq/custom/displayName";
import _migrateUserFormSchema from "@/forms/siarnaq/migrateUserFormSchema";
import { useUsers } from "@/hooks/siarnaq/useCdrUsers";
import { useCurriculums } from "@/hooks/siarnaq/useCurriculums";
import { useUserPayments } from "@/hooks/siarnaq/useUserPayments";
import { useUserPurchases } from "@/hooks/siarnaq/useUserPurchases";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiOutlinePencil } from "react-icons/hi2";
import z from "zod";

import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

interface RecapPanelProps {
  user: CdrUser;
  refetch: () => void;
}

export const RecapPanel = ({ user, refetch }: RecapPanelProps) => {
  const tZod = useTranslations("siarnaq.migrateUserFormSchema");
  const migrateUserFormSchema = _migrateUserFormSchema(tZod);
  const t = useTranslations("siarnaq");
  const format = useFormatter();
  const { toast } = useToast();
  const { total: totalPaid, refetch: refetchPayments } = useUserPayments(
    user.id,
  );
  const { total: totalToPay } = useUserPurchases(user.id);
  const { curriculums } = useCurriculums();
  const remainingToPay = (totalToPay ?? 0) - (totalPaid ?? 0);
  const [isOpened, setIsOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const hasUserCurriculum = !!user.curriculum?.id;
  const [selectedCurriculum, setSelectedCurriculum] = useState(
    user.curriculum?.id,
  );

  const { newPaymentNotification, setNewPaymentNotification } = useUsers();

  const validEmailRegex = /^[\w\-.]*@etu(-enise)?\.ec-lyon\.fr$/;
  function closeDialog(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    setIsOpened(false);
  }
  async function onCurriculumSubmit() {
    setIsLoading(true);
    if (!selectedCurriculum) {
      setIsLoading(false);
      setIsOpened(false);
      return;
    }
    let error;
    if (hasUserCurriculum) {
      const { error: patchError } =
        await patchCdrUsersUserIdCurriculumsCurriculumId({
          path: {
            user_id: user.id,
            curriculum_id: selectedCurriculum,
          },
        });
      error = patchError;
    } else {
      const { error: postError } =
        await postCdrUsersUserIdCurriculumsCurriculumId({
          path: {
            user_id: user.id,
            curriculum_id: selectedCurriculum,
          },
        });
      error = postError;
    }
    if (error) {
      toast({
        description: error.detail,
        variant: "destructive",
      });
      setIsLoading(false);
      setIsOpened(false);
      return;
    }
    refetch();
    setIsOpened(false);
    setIsLoading(false);
  }

  const form = useForm<z.infer<typeof migrateUserFormSchema>>({
    resolver: zodResolver(migrateUserFormSchema),
    mode: "onBlur",
    defaultValues: {
      nickname: user.nickname ?? undefined,
      email: user.email ?? undefined,
      floor: user.floor ?? undefined,
      birthday: undefined,
      phone: undefined,
      promo: user.promo?.toString() ?? "null",
    },
  });

  useEffect(() => {
    form.reset({
      nickname: user.nickname ?? undefined,
      email: user.email ?? undefined,
      floor: user.floor ?? undefined,
      birthday: undefined,
      phone: undefined,
      promo: user.promo?.toString() ?? "null",
    });
  }, [user, form]);

  useEffect(() => {
    if (newPaymentNotification?.user_id === user.id) {
      console.log("Payment received for user:", user.id);

      setNewPaymentNotification(null);
      refetchPayments().then(({}) => {
        toast({
          title: t("recapPanel.paymentReceived"),
          variant: "default",
        });
      });
    }
  }, [
    newPaymentNotification,
    setNewPaymentNotification,
    user.id,
    refetchPayments,
    t,
    toast,
  ]);

  async function onSubmit(values: z.infer<typeof migrateUserFormSchema>) {
    setIsLoading(true);
    const body: CdrUserUpdate = {
      nickname: values.nickname,
      floor: values.floor,
      email:
        (values.email ?? validEmailRegex.test(values.email!))
          ? values.email
          : null,
      promo:
        values.promo === "null" || !values.promo
          ? undefined
          : parseInt(values.promo),
      // birthday: values.birthday?.toISOString(),
      // phone: values.phone ? "+" + values.phone : null,
    };
    const { error } = await patchCdrUsersUserId({
      path: {
        user_id: user.id,
      },
      body: body,
    });
    if (error) {
      toast({
        description: error.detail,
        variant: "destructive",
      });
      setIsLoading(false);
      setIsOpened(false);
      return;
    }
    setIsLoading(false);
    setIsOpened(false);
    form.reset({
      nickname: values.nickname ?? undefined,
      email: values.email ?? undefined,
      floor: values.floor ?? undefined,
      birthday: values.birthday ? new Date(values.birthday) : undefined,
      phone: values.phone ?? undefined,
      promo: values.promo?.toString(),
    });
  }

  return (
    <div className="grid gap-12 pt-8">
      <div className="space-y-8">
        <CardTitle className="flex flex-row justify-between items-center">
          <div>
            <UserDisplayName user={user} />
          </div>
          <div className="flex gap-4 items-center">
            <span className="font-semibold text-base">
              {user.curriculum?.name ?? t("recapPanel.noCurriculum")}
            </span>
            <CustomDialog
              isOpened={isOpened}
              setIsOpened={setIsOpened}
              title={t("recapPanel.editCurriculum")}
              description={
                <div className="grid gap-6 mt-4">
                  <div className="grid gap-2">
                    <Label>{t("recapPanel.curriculum")}</Label>
                    <Select
                      onValueChange={setSelectedCurriculum}
                      defaultValue={selectedCurriculum}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent side="top">
                        {curriculums.map((curriculum) => (
                          <SelectItem key={curriculum.id} value={curriculum.id}>
                            <div className="flex items-center flex-row gap-2">
                              {curriculum.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end mt-2 space-x-4">
                    <Button
                      variant="outline"
                      onClick={closeDialog}
                      disabled={isLoading}
                      className="w-25"
                    >
                      {t("recapPanel.cancel")}
                    </Button>
                    <LoadingButton
                      isLoading={isLoading}
                      className="w-25"
                      type="button"
                      onClick={onCurriculumSubmit}
                    >
                      {t("recapPanel.edit")}
                    </LoadingButton>
                  </div>
                  <TextSeparator text={t("recapPanel.editUser")} />
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <MigrateUserForm
                        form={form}
                        setIsOpened={setIsOpened}
                        isLoading={isLoading}
                        closeDialog={closeDialog}
                      />
                    </form>
                  </Form>
                </div>
              }
            >
              <Button size="icon" variant="outline" className="w-10">
                <HiOutlinePencil className="h-5 w-5" />
              </Button>
            </CustomDialog>
          </div>
        </CardTitle>
        <MembershipRecap user={user} />
        <Separator />
      </div>
      <ProductPart user={user} isAdmin />
      <PaymentPart user={user} isAdmin />
      <div className="grid gap-4">
        <CardTitle className="flex flex-row w-full">
          <span className="font-bold">{t("recapPanel.leftToPay")}</span>
          <span className="ml-auto font-semibold">
            {format.number(remainingToPay, "euro")}
          </span>
        </CardTitle>

        <div className="flex justify-end">
          <PaymentQrButton
            targetUserId={user.id}
            userName={`${user.firstname} ${user.name}`}
            amount={remainingToPay}
            disabled={remainingToPay < 1}
          />
        </div>
      </div>
    </div>
  );
};
