import { LoadingButton } from "../../custom/LoadingButton";
import { UseFormReturn } from "react-hook-form";
import { RegisteringFormValues } from "@/src/forms/registering";
import { Carousel, CarouselApi, CarouselContent } from "../../ui/carousel";
import { InformationCard } from "./InformationCard";
import { ParticipationCard } from "./ParticipationCard";
import { SportCard } from "./SportCard";
import { BasketCard } from "./BasketCard";
import { SetStateAction, useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RegisterState } from "@/src/infra/registerState";
import { SummaryCard } from "./SummaryCard";
import { Sport } from "@/src/api/hyperionSchemas";
import { EditProductValues } from "@/src/forms/editProducts";
import { CardTemplate } from "./CardTemplate";

interface RegisterFormFieldProps {
  form: UseFormReturn<RegisteringFormValues>;
  isLoading: boolean;
  onSubmit: (values: RegisteringFormValues) => void;
  sports?: Sport[];
  setState: (state: SetStateAction<RegisterState>) => void;
  state: RegisterState;
  api?: CarouselApi | undefined;
  setApi?: (api: CarouselApi) => void;
}

export const RegisterFormField = ({
  form,
  isLoading,
  onSubmit,
  sports,
  setState,
  state,
  api,
  setApi,
}: RegisterFormFieldProps) => {
  const showSportFields = form.watch("is_athlete");

  useEffect(() => {
    const showSportFields = form.watch("is_athlete");
    const newSubtitles = [...state.allHeaderSubtitles];

    if (showSportFields && state.allHeaderSubtitles[2] !== "Sport") {
      newSubtitles.splice(2, 0, "Sport");
    } else if (state.allHeaderSubtitles[2] === "Sport") {
      newSubtitles.splice(2, 1);
    }

    setState((state) => ({
      ...state,
      allHeaderSubtitles: newSubtitles,
      stepDone: Math.min(state.stepDone, 2),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSportFields]);

  return (
    <div className="gap-6 p-8 w-full flex flex-col h-[calc(100vh-12rem)]">
      <Carousel setApi={setApi} opts={{ watchDrag: false }}>
        <CarouselContent className="h-[calc(100vh-16rem)]" draggable={false}>
          <InformationCard form={form} />
          <ParticipationCard form={form} />
          {showSportFields && <SportCard form={form} sports={sports} />}
          <CardTemplate>
            <BasketCard
              form={form as unknown as UseFormReturn<EditProductValues>}
            />
          </CardTemplate>
          <SummaryCard form={form} />
        </CarouselContent>
      </Carousel>

      <div className="flex justify-start mt-4 gap-4">
        <Button
          size="icon"
          onClick={() => {
            api?.scrollPrev();
            setState((state) => ({
              ...state,
              currentStep: Math.max(0, state.currentStep - 1),
              headerSubtitle:
                state.allHeaderSubtitles[Math.max(0, state.currentStep - 1)],
            }));
          }}
          disabled={!api?.canScrollPrev()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {api?.canScrollNext() ? (
          <Button
            size="icon"
            onClick={() => {
              form.trigger().then((result) => {
                if (!result) {
                  const shouldBeValid = state.pageFields[state.headerSubtitle];
                  const isValid = shouldBeValid.every(
                    (field) => !form.getFieldState(field).invalid,
                  );
                  if (!isValid) {
                    return;
                  }
                }
                state.onValidateCardActions[state.headerSubtitle](
                  form.getValues(),
                  () => {
                    api?.scrollNext();
                    setState((state) => ({
                      ...state,
                      stepDone: Math.max(state.stepDone, state.currentStep + 1),
                      currentStep: Math.min(3, state.currentStep + 1),
                      headerSubtitle:
                        state.allHeaderSubtitles[state.currentStep + 1],
                    }));
                  },
                );
              });
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <LoadingButton
            isLoading={isLoading}
            className="w-[200px]"
            type="submit"
            onClick={() => onSubmit(form.getValues())}
          >
            S&apos;inscrire
          </LoadingButton>
        )}
      </div>
    </div>
  );
};
