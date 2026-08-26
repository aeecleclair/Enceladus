"use client";

import { useAuth } from "@/app/authContext";
import { JoinTeamDialog } from "@/components/raid/home/JoinTeamDialog";
import { UserShell } from "@/components/raid/home/UserShell";
import { useRouter } from "@/i18n/navigation";
import { useInviteTokenStore } from "@/stores/raid/inviteTokenStore";

import { use, useEffect, useState } from "react";

import { UserPlus2 } from "lucide-react";

interface InviteLandingProps {
  params: Promise<{ token: string; locale: string }>;
}

const InviteLanding = ({ params }: InviteLandingProps) => {
  const { token: inviteToken } = use(params);
  const { isTokenQueried, token } = useAuth();
  const { setInviteToken } = useInviteTokenStore();
  const [isOpened, setIsOpened] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (isTokenQueried && token === null) {
      setInviteToken(inviteToken);
      router.replace("/login");
      return;
    }
    if (inviteToken) {
      // `isOpened` already defaults to true; only persist the token here.
      setInviteToken(inviteToken);
    }
  }, [isTokenQueried, token, inviteToken, setInviteToken, router]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.replace("/");
    }
    setIsOpened(open);
  };

  return (
    <UserShell>
      <main className="mx-auto flex w-full flex-col py-4 sm:py-5">
        <section className="rounded-2xl border border-border/70 bg-card/85 p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UserPlus2 className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                Invitation d&apos;équipe
              </h1>
              <p className="text-sm text-muted-foreground">
                Invitation reçue: confirmez pour rejoindre l&apos;équipe.
              </p>
            </div>
          </div>
        </section>
      </main>
      <JoinTeamDialog isOpened={isOpened} setIsOpened={handleOpenChange} />
    </UserShell>
  );
};

export default InviteLanding;
