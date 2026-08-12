import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";

import _eventFormSchema from "@/forms/sg/eventFormSchema";
import _sessionFormSchema from "@/forms/sg/sessionFormSchema";
import _categoryFormSchema from "@/forms/sg/categoryFormSchema";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEvents } from "@/hooks/sg/useEvents";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { LoadingButton } from "@/components/common/LoadingButton";

import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { EventCard } from "./EventCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AddEventState from "@/infra/AddEventState";
import { SessionCard } from "./SessionsCard";
import { useSessions } from "@/hooks/sg/useSessions";
import { useCategories } from "@/hooks/sg/useCategories";
import { useSession } from "@/hooks/sg/useSession";
import { useCategory } from "@/hooks/sg/useCategory";

import {
  AppModulesTicketingSchemasTicketingEventBase as TicketingEventBase,
  AppModulesTicketingSchemasTicketingEventComplete,
  CategoryCreate,
  CategoryUpdate,
  SessionBase,
  SessionUpdate,
} from "@/api";
import { useEvent } from "@/hooks/sg/useEvent";
import { patchTicketingSessionsSessionIdMutation, patchTicketingCategoriesCategoryIdMutation } from "@/api/@tanstack/react-query.gen";
import { useMutation } from "@tanstack/react-query";
import { CategoryCard } from "./CategoriesCard";


interface AddEditEventFormProps {
  state: AddEventState;
  setState: React.Dispatch<React.SetStateAction<AddEventState>>;
  isEdit?: boolean;
  creatorId: string;
  eventId?: string;
  initialStep?: number;
}

export type StagedSession = z.infer<ReturnType<typeof _sessionFormSchema>> & {
  id: string;
  isExisting?: boolean;
};

type StagedCategory = z.infer<ReturnType<typeof _categoryFormSchema>> & {
  id: string;
  isExisting?: boolean;
};

const makeStagedId = () => {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const AddEditEventForm = ({
  state,
  setState,
  isEdit = false,
  eventId,
  initialStep = 0,
}: AddEditEventFormProps) => {
  const router = useRouter();
  const [api, setApi] = useState<CarouselApi | undefined>(undefined);

  useEffect(() => {
    if (api && initialStep > 0) {
      api.scrollTo(initialStep, true);
    }
  }, [api, initialStep]);
  const t = useTranslations("sg");
  const format = useFormatter();


  const searchParams = useSearchParams();
  const organiserId = searchParams.get("organiserId") || "";

  const [isLoading, setIsLoading] = useState(false);
  const isEditModeFromQuery = searchParams.get("editMode") === "true";
  const [createdEventId, setCreatedEventId] = useState<string | null>(null);

  const [isSubmittingSessions, setIsSubmittingSessions] = useState(false);
  const [stagedSessions, setStagedSessions] = useState<StagedSession[]>([]);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [sessionsListError, setSessionsListError] = useState<string | null>(null);

  const [isSubmittingCategories, setIsSubmittingCategories] = useState(false);
  const [stagedCategories, setStagedCategories] = useState<StagedCategory[]>([]);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoriesListError, setCategoriesListError] = useState<string | null>(null);

  const eventFormSchema = _eventFormSchema();
  const sessionFormSchema = _sessionFormSchema();
  const categoryFormSchema = _categoryFormSchema();


  const { refetch: refetchEvents, postEvent } = useEvents();
  const { events: existingEventData, patchEvent } = useEvent({ eventId: eventId || "" });

  const { refetch: refetchSessions, postSessionAsync } = useSessions(createdEventId);
  const { refetch: refetchCategories, postCategoryAsync } = useCategories();
  const { deleteSession } = useSession({});
  const { deleteCategory } = useCategory({});

  const { mutateAsync: patchSessionAsync } = useMutation({
    ...patchTicketingSessionsSessionIdMutation(),
  });
  const { mutateAsync: patchCategoryAsync } = useMutation({
    ...patchTicketingCategoriesCategoryIdMutation(),
  });

  const hasInitialized = useRef(false);


  const eventForm = useForm<z.infer<typeof eventFormSchema>>({
      resolver: zodResolver(eventFormSchema),
      mode: "onBlur",
      defaultValues: {
          name: "",
          open_date: new Date(),
          close_date: new Date(),
          // quota: 0,
          // user_quota: 0,
          organiser_id: organiserId,
      },
  });

  const sessionForm = useForm<z.infer<typeof sessionFormSchema>>({
      resolver: zodResolver(sessionFormSchema),
      mode: "onBlur",
      defaultValues: {
          event_id: createdEventId || "",
          name: "",
          date: new Date(),
          // quota: 0,
          // user_quota: 0,
      },
  });

  const categoryForm = useForm<z.infer<typeof categoryFormSchema>>({
      resolver: zodResolver(categoryFormSchema),
      mode: "onBlur",
      defaultValues: {
          event_id: createdEventId || "",
          name: "",
          // quota: 0,
          // user_quota: 0,
          price: 0,
          disabled: false,
          linked_sessions: [],
          required_membership: "",
      },
  });

  useEffect(() => {
    if (createdEventId) {
      sessionForm.setValue("event_id", createdEventId);
      categoryForm.setValue("event_id", createdEventId);
    }
  }, [categoryForm, createdEventId, sessionForm]);

  useEffect(() => {
    if (!isEdit || !isEditModeFromQuery || !eventId || hasInitialized.current) return;
    const event = existingEventData as unknown as AppModulesTicketingSchemasTicketingEventComplete;
    if (!event?.id) return;

    hasInitialized.current = true;
    setCreatedEventId(event.id);

    eventForm.reset({
      name: event.name,
      open_date: new Date(event.open_date),
      close_date: event.close_date ? new Date(event.close_date) : new Date(),
      quota: event.quota ?? 0,
      user_quota: event.user_quota ?? 0,
      organiser_id: event.organiser_id,
    });

    setStagedSessions(
      (event.sessions ?? []).map((s) => ({
        event_id: s.event_id,
        name: s.name,
        date: new Date(s.date),
        quota: s.quota ?? 0,
        user_quota: s.user_quota ?? 0,
        id: s.id,
        isExisting: true,
      }))
    );

    setStagedCategories(
      (event.categories ?? []).map((c) => ({
        event_id: c.event_id,
        name: c.name,
        quota: c.quota ?? 0,
        user_quota: c.user_quota ?? 0,
        price: c.price,
        disabled: c.disabled,
        linked_sessions: [],
        required_membership: c.required_mebership ?? "",
        id: c.id,
        isExisting: true,
      }))
    );
  }, [isEdit, isEditModeFromQuery, eventId, existingEventData, eventForm]);


    function toIso(value: Date): string {
        return new Date(value).toISOString();
    }

    async function onEventSubmit(values: z.infer<typeof eventFormSchema>, onSuccess?: () => void) {
        setIsLoading(true);

        if ((isEdit || isEditModeFromQuery) && createdEventId) {
            const body = {
                name: values.name,
                open_date: toIso(values.open_date),
                close_date: values.close_date ? toIso(values.close_date) : null,
                quota: values.quota,
                user_quota: values.user_quota,
            };
            patchEvent(createdEventId, body, () => {
                refetchEvents();
                setIsLoading(false);
                if (onSuccess) onSuccess();
            });
            return;
        }

        const body: TicketingEventBase = {
            ...values,
            open_date: toIso(values.open_date),
            close_date: toIso(values.close_date ?? values.open_date ?? new Date()),
        };

        postEvent(body, (response) => {
          const payload = response as { data?: { id?: string }; id?: string };
          const newEventId = payload.data?.id || payload.id;
            if (newEventId) {
                setCreatedEventId(newEventId);
                sessionForm.setValue("event_id", newEventId);
            categoryForm.setValue("event_id", newEventId);
                setStagedSessions([]);
            setStagedCategories([]);
                setEditingSessionId(null);
            setEditingCategoryId(null);
            }
            refetchEvents();
            setIsLoading(false);
            if (onSuccess) onSuccess();
        });
    }

    const resetForm = (isSessionForm: boolean) => {
      if (isSessionForm) {
        sessionForm.reset({
          event_id: createdEventId || "",
          name: "",
          date: new Date(),
          quota: 0,
          user_quota: 0,
        });
        return;
      }

      categoryForm.reset({
        event_id: createdEventId || "",
        name: "",
        quota: 0,
        user_quota: 0,
        price: 0,
        disabled: false,
        linked_sessions: [],
        required_membership: "",
      });
    };

    const buildSessionPayload = (session: StagedSession): SessionBase => {
      return {
        ...session,
        event_id: createdEventId || session.event_id,
        date: toIso(session.date),
      };
    };

    const addOrUpdateSession = async () => {
      if (!createdEventId) {
        setSessionsListError("Create the event before adding sessions.");
        return;
      }

      const isValid = await sessionForm.trigger();
      if (!isValid) return;

      const values = sessionForm.getValues();
      const existingSession = editingSessionId
        ? stagedSessions.find((session) => session.id === editingSessionId)
        : undefined;
      const nextSession: StagedSession = {
        ...values,
        event_id: createdEventId,
        id: editingSessionId || makeStagedId(),
        isExisting: existingSession?.isExisting ?? false,
      };

      setStagedSessions((current) => {
        if (editingSessionId) {
          return current.map((session) =>
            session.id === editingSessionId ? nextSession : session
          );
        }
        return [...current, nextSession];
      });

      setEditingSessionId(null);
      setSessionsListError(null);
      resetForm(true);
    };

    const editSession = (session: StagedSession) => {
      setEditingSessionId(session.id);
      sessionForm.reset({
        event_id: session.event_id,
        name: session.name,
        date: session.date,
        quota: session.quota,
        user_quota: session.user_quota,
      });
    };

    const removeSession = (sessionId: string) => {
      const doRemove = () => {
        setStagedSessions((current) => current.filter((s) => s.id !== sessionId));
        if (editingSessionId === sessionId) {
          setEditingSessionId(null);
          resetForm(true);
        }
      };
      const session = stagedSessions.find((s) => s.id === sessionId);
      if (session?.isExisting) {
        deleteSession(sessionId, doRemove);
      } else {
        doRemove();
      }
    };

    const addOrUpdateCategory = async () => {
      if (!createdEventId) {
        setCategoriesListError("Create the event before adding categories.");
        return;
      }

      const isValid = await categoryForm.trigger();
      if (!isValid) return;

      const values = categoryForm.getValues();
      const existingCategory = editingCategoryId
        ? stagedCategories.find((category) => category.id === editingCategoryId)
        : undefined;
      const nextCategory: StagedCategory = {
        ...values,
        event_id: createdEventId,
        id: editingCategoryId || makeStagedId(),
        isExisting: existingCategory?.isExisting ?? false,
        price: Math.round(values.price * 100),
      };

      setStagedCategories((current) => {
        if (editingCategoryId) {
          return current.map((category) =>
            category.id === editingCategoryId ? nextCategory : category
          );
        }
        return [...current, nextCategory];
      });

      setEditingCategoryId(null);
      setCategoriesListError(null);
      resetForm(false);
    };

    const editCategory = (category: StagedCategory) => {
      setEditingCategoryId(category.id);
      categoryForm.reset({
        event_id: category.event_id,
        name: category.name,
        quota: category.quota,
        user_quota: category.user_quota,
        price: category.price / 100,
        disabled: category.disabled,
        linked_sessions: category.linked_sessions,
        required_membership: category.required_membership,
      });
    };

    const removeCategory = (categoryId: string) => {
      const doRemove = () => {
        setStagedCategories((current) => current.filter((c) => c.id !== categoryId));
        if (editingCategoryId === categoryId) {
          setEditingCategoryId(null);
          resetForm(false);
        }
      };
      const category = stagedCategories.find((c) => c.id === categoryId);
      if (category?.isExisting) {
        deleteCategory(categoryId, doRemove);
      } else {
        doRemove();
      }
    };

    const buildCategoryPayload = (category: StagedCategory): CategoryCreate => {
      return {
        event_id: createdEventId || category.event_id,
        name: category.name,
        required_mebership: category.required_membership || null,
        quota: category.quota,
        user_quota: category.user_quota,
        price: category.price,
      };
    };

    const submitAllStagedData = async () => {
      if (!createdEventId || stagedSessions.length === 0) {
        setSessionsListError("Add at least one session before submitting.");
        return;
      }

      if (stagedCategories.length === 0) {
        setCategoriesListError("Add at least one category before submitting.");
        return;
      }

      setIsSubmittingSessions(true);
      setIsSubmittingCategories(true);
      let failedCount = 0;

      for (const session of stagedSessions) {
        try {
          if (session.isExisting) {
            const body: SessionUpdate = {
              name: session.name,
              quota: session.quota,
              user_quota: session.user_quota,
              date: toIso(session.date),
            };
            await patchSessionAsync({ body, path: { session_id: session.id } });
          } else {
            await postSessionAsync(buildSessionPayload(session));
          }
        } catch (error) {
          failedCount += 1;
        }
      }

      for (const category of stagedCategories) {
        try {
          if (category.isExisting) {
            const body: CategoryUpdate = {
              name: category.name,
              quota: category.quota,
              user_quota: category.user_quota,
              price: category.price,
              required_mebership: category.required_membership || null,
            };
            await patchCategoryAsync({ body, path: { category_id: category.id } });
          } else {
            await postCategoryAsync(buildCategoryPayload(category));
          }
        } catch (error) {
          failedCount += 1;
        }
      }

      setIsSubmittingSessions(false);
      setIsSubmittingCategories(false);
      refetchSessions();
      refetchCategories();

      if (failedCount === 0) {
        setStagedSessions([]);
        setStagedCategories([]);
        resetForm(true);
        resetForm(false);
        router.push(`/admin/manage?eventId=${createdEventId}`);
      }
    };

    const moveToNextStep = () => {
      api?.scrollNext();
      setState((state) => ({
        ...state,
        stepDone: Math.max(state.stepDone, state.currentStep + 1),
        currentStep: Math.min(state.allHeaderSubtitles.length - 1, state.currentStep + 1),
        headerSubtitle: state.allHeaderSubtitles[state.currentStep + 1],
      }));
    };



  const formatDate = (value?: Date) => {
    if (!value) return "-";
    return format.dateTime(value, { dateStyle: "medium" });
  };

  const isLastStep = state.currentStep >= state.allHeaderSubtitles.length - 1;
  const isSubmittingFinal = isSubmittingSessions || isSubmittingCategories;
  const eventStartDate = eventForm.watch("open_date");
  const eventEndDate = eventForm.watch("close_date");

  return (
    <div>
      <Carousel className="w-full" setApi={setApi} opts={{ watchDrag: false }} onKeyDownCapture={(e) => { if (e.key === "ArrowLeft" || e.key === "ArrowRight") e.stopPropagation() }}>
        <CarouselContent>
          <CarouselItem>
            <Form {...eventForm}>
              <form
                onSubmit={(e) => {
                    eventForm.setValue("organiser_id", organiserId || "");
                    eventForm.handleSubmit((values) => {
                            console.log("Form submitted with values:", values);
                            onEventSubmit(values, moveToNextStep);
                      })(e);
                  }}
                >
                <EventCard form={eventForm} />
                <div className="flex justify-end mt-2 space-x-4 pb-4">
                  <Button
                    variant="outline"
                    disabled={isLoading}
                    className="w-25"
                  >
                    {t("addEditEventForm.cancel")}
                  </Button>
                  <LoadingButton isLoading={isLoading} className="w-25" type="submit">
                    {(isEdit || isEditModeFromQuery) ? t("addEditEventForm.edit") : t("addEditEventForm.add")}
                  </LoadingButton>
                </div>
              </form>
            </Form>
          </CarouselItem>
          <CarouselItem>
            <Form {...sessionForm}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addOrUpdateSession();
                }}
              >
                <SessionCard
                  form={sessionForm}
                  minDate={eventStartDate}
                  maxDate={eventEndDate}
                >
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingSessionId(null);
                        resetForm(true);
                      }}
                    >
                      Clear
                    </Button>
                    <Button type="submit" disabled={!createdEventId}>
                      {editingSessionId ? "Update session" : "Add session to list"}
                    </Button>
                  </div>
                  <div className="grid gap-2">
                    <div className="text-sm font-medium">Staged sessions</div>
                    {sessionsListError ? (
                      <div className="text-sm text-destructive">{sessionsListError}</div>
                    ) : null}
                    {stagedSessions.length === 0 ? (
                      <div className="text-sm text-muted-foreground">
                        No sessions added yet.
                      </div>
                    ) : (
                      <div className="grid gap-2">
                        {stagedSessions.map((session) => (
                          <div
                            key={session.id}
                            className="flex flex-wrap items-center justify-between gap-2 rounded-md border bg-background p-3"
                          >
                            <div>
                              <div className="font-medium">{session.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {formatDate(session.date)} · quota {session.quota || 0} · user quota {session.user_quota || 0}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button type="button" variant="outline" onClick={() => editSession(session)}>
                                Edit
                              </Button>
                              <Button type="button" variant="destructive" onClick={() => removeSession(session.id)}>
                                Remove
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </SessionCard>
              </form>
            </Form>
          </CarouselItem>
          <CarouselItem>
            <Form {...categoryForm}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addOrUpdateCategory();
                }}
              >
                <CategoryCard
                  form={categoryForm}
                  sessions={stagedSessions}
                  >
                <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingCategoryId(null);
                        resetForm(false);
                      }}
                    >
                      Clear
                    </Button>
                    <Button type="submit" disabled={!createdEventId}>
                      {editingCategoryId ? "Update category" : "Add category to list"}
                    </Button>
                  </div>
                  <div className="grid gap-2">
                    <div className="text-sm font-medium">Staged categories</div>
                    {categoriesListError ? (
                      <div className="text-sm text-destructive">{categoriesListError}</div>
                    ) : null}
                    {stagedCategories.length === 0 ? (
                      <div className="text-sm text-muted-foreground">
                        No categories added yet.
                      </div>
                    ) : (
                      <div className="grid gap-2">
                        {stagedCategories.map((category) => (
                          <div
                            key={category.id}
                            className="flex flex-wrap items-center justify-between gap-2 rounded-md border bg-background p-3"
                          >
                            <div>
                              <div className="font-medium">{category.name}</div>
                              <div className="text-sm text-muted-foreground">
                                price {category.price/100} · quota {category.quota || 0} · user quota {category.user_quota || 0}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button type="button" variant="outline" onClick={() => editCategory(category)}>
                                Edit
                              </Button>
                              <Button type="button" variant="destructive" onClick={() => removeCategory(category.id)}>
                                Remove
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CategoryCard>
              </form>
            </Form>
          </CarouselItem>
          <CarouselItem>
            <div className="grid gap-4 rounded-md shadow-md bg-background p-4 m-4">
              <div className="text-lg font-semibold">Summary</div>
              <div className="grid gap-2">
                <div className="text-sm font-medium">Event</div>
                <div className="text-sm text-muted-foreground">
                  {eventForm.getValues("name") || "Untitled"} · {formatDate(eventForm.getValues("open_date"))}
                </div>
              </div>
              <div className="grid gap-2">
                <div className="text-sm font-medium">Sessions ({stagedSessions.length})</div>
                {stagedSessions.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No sessions staged yet.
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {stagedSessions.map((session) => (
                      <div key={session.id} className="text-sm text-muted-foreground">
                        {session.name} · {formatDate(session.date)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <div className="text-sm font-medium">Categories ({stagedCategories.length})</div>
                {stagedCategories.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No categories staged yet.
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {stagedCategories.map((category) => (
                      <div key={category.id} className="text-sm text-muted-foreground">
                        {category.name} · price {category.price / 100}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex justify-end">
                <LoadingButton
                  isLoading={isSubmittingFinal}
                  disabled={!createdEventId || stagedSessions.length === 0 || stagedCategories.length === 0 || isSubmittingFinal}
                  onClick={submitAllStagedData}
                >
                 {((isEdit || isEditModeFromQuery)) ? "Sauvegarder les modifications" : "Create sessions and categories"}
                </LoadingButton>
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
      <div className="flex items-center justify-between mt-6 pt-4 border-t">
        <Button
          variant="ghost"
          className="gap-1.5 rounded-full px-5"
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
          Retour
        </Button>

        <span className="text-sm font-medium text-muted-foreground tabular-nums">
          {state.currentStep + 1} / {state.allHeaderSubtitles.length}
        </span>

        {!isLastStep ? (
          <Button
            className="gap-1.5 rounded-full px-5"
            disabled={isLoading || isSubmittingFinal}
            onClick={async () => {
              if (state.currentStep === 0) {
                eventForm.setValue("organiser_id", organiserId || "");
                const isValid = await eventForm.trigger();
                if (!isValid) return;

                if ((isEdit || isEditModeFromQuery) || !createdEventId) {
                  const values = eventForm.getValues();
                  onEventSubmit(values, moveToNextStep);
                  return;
                }

                moveToNextStep();
                return;
              }

              if (state.currentStep === 1) {
                if (stagedSessions.length === 0) {
                  setSessionsListError("Add at least one session before continuing.");
                  return;
                }
                setSessionsListError(null);
                moveToNextStep();
                return;
              }

              if (state.currentStep === 2) {
                if (stagedCategories.length === 0) {
                  setCategoriesListError("Add at least one category before continuing.");
                  return;
                }
                setCategoriesListError(null);
                moveToNextStep();
                return;
              }

              moveToNextStep();
            }}
          >
            Suivant
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <LoadingButton
            isLoading={isSubmittingFinal}
            className="rounded-full px-5"
            disabled={!createdEventId || stagedSessions.length === 0 || stagedCategories.length === 0 || isSubmittingFinal}
            onClick={submitAllStagedData}
          >
            {(isEdit || isEditModeFromQuery) ? "Sauvegarder" : "Créer l'événement"}
          </LoadingButton>
        )}
      </div>
    </div>
  );
};
