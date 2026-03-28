"use client";

import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "../hooks/useUser";
import { AppSidebar } from "../components/home/appSideBar/AppSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../components/ui/sidebar";
import { Button } from "../components/ui/button";
import { useEdition } from "../hooks/useEdition";
import { useCompetitionUser } from "../hooks/useCompetitionUser";
import { EditionWaitingCard } from "../components/home/EditionWaitingCard";
import { IncompleteRegistrationCard } from "../components/home/IncompleteRegistrationCard";
import { FullyRegisteredDashboard } from "../components/home/FullyRegisteredDashboard";
import { UserDashboard } from "../components/home/UserDashboard";
import { useSportSchools } from "../hooks/useSportSchools";
import { UnregisteredCard } from "../components/home/UnregisteredCard";
import { useUserPurchases } from "../hooks/useUserPurchases";
import { useSchools } from "../hooks/useSchools";

const Home = () => {
  const { isTokenQueried, token } = useAuth();
  const { me: user } = useUser();
  const { meCompetition, isLoading } = useCompetitionUser();
  const { hasPaid } = useUserPurchases({ userId: user?.id });
  const searchParams = useSearchParams();
  const router = useRouter();
  const { edition } = useEdition();
  const { sportSchools } = useSportSchools();
  const { NoSchoolId } = useSchools();

  const devParam = searchParams.get("dev_during_event");

  useEffect(() => {
    if (devParam === "true") {
      document.cookie = "dev_during_event=true; path=/";
    }
  }, [devParam]);

  const devDuringEvent =
    devParam === "true" ||
    (typeof document !== "undefined" &&
      document.cookie.split("; ").some((c) => c === "dev_during_event=true"));

  const isEditionStarted =
    devDuringEvent ||
    (edition?.start_date ? new Date() >= new Date(edition.start_date) : false);

  const isEditionEnded =
    !devDuringEvent &&
    (edition?.end_date ? new Date() >= new Date(edition.end_date) : false);

  const isFullyRegistered = meCompetition?.validated && hasPaid;

  const isParticipant =
    meCompetition?.is_athlete ||
    meCompetition?.is_cameraman ||
    meCompetition?.is_fanfare ||
    meCompetition?.is_pompom;

  const userSportSchool = sportSchools?.find(
    (school) => school.school_id === user?.school_id,
  );
  const isSchoolInscriptionEnabled = userSportSchool?.inscription_enabled;

  if (isTokenQueried && token === null) {
    router.replace("/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        {user?.school_id == NoSchoolId ? (
          <div className="flex flex-col relative overflow-auto h-full m-6">
            <span className="text-xl text-muted-foreground text-center px-4 justify-center items-center flex h-full">
              Vous n&apos;êtes pas connecté avec une addresse mail académique ou
              celle-ci n&apos;est pas reconnue par le système.
              <br />
              Veuillez vous connecter avec une adresse académique valide pour
              accéder à la compétition.
            </span>
          </div>
        ) : (
          <div className="flex flex-col relative overflow-auto h-full m-6">
            {devDuringEvent ? (
              edition && (
                <UserDashboard
                  edition={edition}
                  meCompetition={meCompetition}
                />
              )
            ) : (
              <>
                {!edition && (
                  <span className="text-sm text-muted-foreground px-4 justify-center items-center flex h-full">
                    Veuillez patienter, l&apos;édition n&apos;est pas encore
                    prête.
                  </span>
                )}
                {edition &&
                  (!edition.inscription_enabled ||
                    !isSchoolInscriptionEnabled) &&
                  !(isEditionStarted || isEditionEnded) && (
                    <EditionWaitingCard
                      edition={{
                        year: edition.year,
                        name: edition.name,
                        start_date: edition.start_date,
                        inscription_enabled:
                          edition.inscription_enabled || false,
                      }}
                      isSchoolInscriptionEnabled={!!isSchoolInscriptionEnabled}
                    />
                  )}
                {edition && isEditionStarted && !isEditionEnded && (
                  <UserDashboard
                    edition={edition}
                    meCompetition={meCompetition}
                  />
                )}
                {edition &&
                  edition.inscription_enabled &&
                  isSchoolInscriptionEnabled &&
                  meCompetition &&
                  isParticipant &&
                  isFullyRegistered &&
                  (!isEditionStarted || isEditionEnded) && (
                    <FullyRegisteredDashboard
                      edition={edition}
                      meCompetition={meCompetition}
                    />
                  )}
                {edition &&
                  edition.inscription_enabled &&
                  isSchoolInscriptionEnabled &&
                  meCompetition &&
                  isParticipant &&
                  !isFullyRegistered && (
                    <IncompleteRegistrationCard
                      edition={edition}
                      meCompetition={meCompetition}
                      hasPaid={hasPaid}
                    />
                  )}
                {edition &&
                  edition.inscription_enabled &&
                  isSchoolInscriptionEnabled &&
                  (!meCompetition || !isParticipant) &&
                  !isLoading &&
                  user &&
                  !(isEditionStarted || isEditionEnded) && (
                    <UnregisteredCard edition={edition} />
                  )}

                {/* Quick access for mobile users */}
                <div className="mt-6 flex justify-center">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-14 gap-3 hover:bg-pink-50 hover:border-pink-300 transition-colors w-full max-w-sm"
                    onClick={() => router.push("/volunteer-shifts")}
                  >
                    <span className="text-sm font-medium">
                      Créneaux bénévoles
                    </span>
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Home;
