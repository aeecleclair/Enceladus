import {
  registeringFormSchema,
  RegisteringFormValues,
} from "@/src/forms/registering";
import { SetStateAction, useEffect, useState } from "react";
import { RegisterFormField } from "./RegisterFormField";
import { Form } from "../../ui/form";
import { RegisterState } from "@/src/infra/registerState";
import { useSports } from "@/src/hooks/useSports";
import { useUser } from "@/src/hooks/useUser";
import { useCompetitionUser } from "@/src/hooks/useCompetitionUser";
import { WaitingPage } from "./WaitingPage";
import { ValidatedPage } from "./ValidatedPage";
import { useParticipant } from "@/src/hooks/useParticipant";
import { useRouter } from "next/navigation";
import { CarouselApi } from "../../ui/carousel";
import { useUserPurchases } from "@/src/hooks/useUserPurchases";
import { UseFormReturn } from "react-hook-form";
import {
  CompetitionUser,
  CoreUser,
  ParticipantComplete,
  Purchase,
  Sport,
} from "@/src/api/hyperionSchemas";

interface RegisterFormProps {
  setState: (value: SetStateAction<RegisterState>) => void;
  state: RegisterState;
  form: UseFormReturn<RegisteringFormValues>;
  userMePurchases?: Purchase[];
  sports?: Sport[];
  me?: CoreUser;
  meCompetition?: CompetitionUser;
  meParticipant?: ParticipantComplete;
}

export const RegisterForm = ({
  setState,
  state,
  form,
  userMePurchases,
  sports,
  me,
  meCompetition,
  meParticipant,
}: RegisterFormProps) => {
  const [api, setApi] = useState<CarouselApi | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  useEffect(() => {
    form.setValue("phone", me?.phone || meCompetition?.user.phone || "");
    form.setValue("sex", meCompetition?.sport_category || "masculine");
    form.setValue("is_athlete", meCompetition?.is_athlete || false);
    form.setValue("is_cameraman", meCompetition?.is_cameraman || false);
    form.setValue("is_fanfare", meCompetition?.is_fanfare || false);
    form.setValue("is_pompom", meCompetition?.is_pompom || false);
    form.setValue("allow_pictures", meCompetition?.allow_pictures ?? true);
    form.setValue("sport.id", meParticipant?.sport_id || "");
    form.setValue("sport.team_id", meParticipant?.team_id || "");
  }, [form, me, meCompetition, meParticipant]);

  async function onSubmit(values: RegisteringFormValues) {
    setIsLoading(true);
    router.refresh();
  }

  useEffect(() => {
    // const newSubtitles = [...state.allHeaderSubtitles];
    // const isAthlete = meCompetition?.is_athlete;
    // console.log("isAthlete", isAthlete);
    // console.log("meParticipant", meParticipant === undefined);
    // console.log(
    //   "meParticipant?.sport_id",
    //   meParticipant?.sport_id === undefined,
    // );
    // if (isAthlete && state.allHeaderSubtitles[2] !== "Sport") {
    //   newSubtitles.splice(2, 0, "Sport");
    // } else if (state.allHeaderSubtitles[2] === "Sport") {
    //   newSubtitles.splice(2, 1);
    // }
    // if (
    //   isAthlete &&
    //   (meParticipant === undefined || meParticipant?.sport_id === undefined)
    // ) {
    //   console.log("SETTING SPORT ACTIONS");
    //   setState((state) => ({
    //     ...state,
    //     currentStep: 3,
    //     stepDone: 2,
    //     headerSubtitle: "Sport",
    //     allHeaderSubtitles: newSubtitles,
    //   }));
    //   console.log("SCROLL TO 2");
    //   api?.scrollTo(2);
    //   return;
    // }
    // if (userMePurchases === undefined || userMePurchases.length === 0) {
    //   console.log("SETTING BASKET ACTIONS");
    //   setState((state) => ({
    //     ...state,
    //     currentStep: isAthlete ? 4 : 3,
    //     stepDone: isAthlete ? 3 : 2,
    //     headerSubtitle: "Panier",
    //     allHeaderSubtitles: newSubtitles,
    //   }));
    //   console.log(newSubtitles);
    //   return;
    // }
    // if (meCompetition && !meCompetition.validated) {
    //   console.log("SETTING SUMMARY ACTIONS");
    //   setState((state) => ({
    //     ...state,
    //     currentStep: isAthlete ? 5 : 4,
    //     stepDone: isAthlete ? 5 : 4,
    //     headerTitle: "Confirmation de l'inscription",
    //     headerSubtitle: "Récapitulatif",
    //     allHeaderSubtitles: newSubtitles,
    //   }));
    //   api?.scrollTo(isAthlete ? 5 : 4);
    //   return;
    // }
    // if (meCompetition && meCompetition.validated) {
    //   console.log("SETTING PAYMENT ACTIONS");
    //   setState((state) => ({
    //     ...state,
    //     currentStep: isAthlete ? 6 : 5,
    //     stepDone: isAthlete ? 6 : 5,
    //     headerTitle: "Paiement",
    //     headerSubtitle: "Récapitulatif",
    //     allHeaderSubtitles: newSubtitles,
    //   }));
    //   api?.scrollTo(isAthlete ? 6 : 5);
    //   return;
    // } else {
    // setState({
    //   ...state,
    //   allHeaderSubtitles: newSubtitles,
    // });
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meCompetition, meParticipant]);

  return meCompetition === undefined ||
    (meCompetition.is_athlete && meParticipant === undefined) ||
    userMePurchases === undefined ||
    userMePurchases.length === 0 ? (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})}>
        <RegisterFormField
          form={form}
          sports={sports}
          isLoading={isLoading}
          onSubmit={onSubmit}
          setState={setState}
          state={state}
          api={api}
          setApi={setApi}
        />
      </form>
    </Form>
  ) : (
    <>
      {meCompetition && !meCompetition.validated && (
        <WaitingPage userMePurchases={userMePurchases} />
      )}
      {meCompetition && meCompetition.validated && (
        <ValidatedPage userMePurchases={userMePurchases} />
      )}
    </>
  );
};
