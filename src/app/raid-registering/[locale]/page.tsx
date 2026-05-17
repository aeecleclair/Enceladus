"use client";

import { ParticipantRegisterCard } from "@/components/raid/register/ParticipantRegisterCard";
import { EditionWaitingCard } from "@/components/raid/home/dashboard/EditionWaitingCard";
import { FullyRegisteredDashboard } from "@/components/raid/home/dashboard/FullyRegisteredDashboard";
import { IncompleteTeamCard } from "@/components/raid/home/dashboard/IncompleteTeamCard";
import { RegistrationClosedCard } from "@/components/raid/home/dashboard/RegistrationClosedCard";
import {
  VolunteerCancelledCard,
  VolunteerDashboardCard,
  VolunteerPendingCard,
} from "@/components/raid/home/dashboard/VolunteerStateCards";
import { StatusDialog } from "@/components/raid/custom/StatusDialog";
import { UserShell } from "@/components/raid/home/UserShell";
import { Skeleton } from "@/components/ui/skeleton";
import { useEdition } from "@/hooks/raid/useEdition";
import { useMeParticipant } from "@/hooks/raid/useMeParticipant";
import { useMeTeam } from "@/hooks/raid/useMeTeam";
import { useMeVolunteer } from "@/hooks/raid/useMeVolunteer";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "@/i18n/navigation";
import { getDaysLeft } from "@/lib/dateFormat";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useInviteTokenStore } from "@/stores/raid/inviteTokenStore";

const Home = () => {
  const { isTokenQueried, token } = useAuth();
  const { me, isFetched, refetch } = useMeParticipant();
  const { team } = useMeTeam();
  const { meVolunteer, isLoading: isVolunteerLoading } = useMeVolunteer();
  const { edition, isLoading: isEditionLoading } = useEdition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const newInviteToken = searchParams.get("invite");
  const code = searchParams.get("code");
  const { setInviteToken } = useInviteTokenStore();
  const [isStatusOpen, setIsStatusOpen] = useState(true);

  useEffect(() => {
    if (isTokenQueried && token === null) {
      router.replace("/login");
    }
  }, [isTokenQueried, token, router]);

  useEffect(() => {
    if (newInviteToken) {
      setInviteToken(newInviteToken);
      router.replace(`/team/invite/${newInviteToken}`);
    }
  }, [newInviteToken, setInviteToken, router]);

  const hasRegistrationClosed =
    edition?.registering_end_date &&
    getDaysLeft(edition.registering_end_date) < 0;

  const renderContent = () => {
    if (isEditionLoading || !isFetched || isVolunteerLoading) {
      return (
        <div className="max-w-2xl mx-auto mt-8 space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      );
    }
    if (!edition) {
      return <EditionWaitingCard />;
    }
    if (me && team?.validation_progress === 100) {
      return <FullyRegisteredDashboard edition={edition} />;
    }
    if (me) {
      return <IncompleteTeamCard team={team} />;
    }
    if (meVolunteer) {
      if (meVolunteer.cancelled) return <VolunteerCancelledCard />;
      if (meVolunteer.validated) return <VolunteerDashboardCard />;
      return <VolunteerPendingCard />;
    }
    if (hasRegistrationClosed) {
      return <RegistrationClosedCard />;
    }
    return <ParticipantRegisterCard />;
  };

  return (
    <UserShell>
      {code === "succeeded" && (
        <StatusDialog
          isOpened={isStatusOpen}
          setIsOpened={setIsStatusOpen}
          title="Paiement effectué"
          description="Votre paiement a été effectué avec succès."
          status="SUCCESS"
          callback={() => {
            refetch();
            setIsStatusOpen(false);
            router.replace("/");
          }}
        />
      )}
      {code === "refused" && (
        <StatusDialog
          isOpened={isStatusOpen}
          setIsOpened={setIsStatusOpen}
          title="Paiement refusé"
          description="Votre paiement a été refusé. Réessayez ou contactez l'organisation."
          status="ERROR"
          callback={() => {
            setIsStatusOpen(false);
            router.replace("/");
          }}
        />
      )}
      <main className="mx-auto w-full py-4 sm:py-6">{renderContent()}</main>
    </UserShell>
  );
};

export default Home;
