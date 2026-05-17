"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "@/i18n/navigation";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

const ShellCard = ({
  icon,
  iconBg,
  iconColor,
  title,
  description,
  cta,
  onCta,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  cta: string;
  onCta: () => void;
}) => (
  <Card className="mx-auto w-full max-w-3xl border-border/70 bg-card/90 shadow-sm">
    <CardHeader>
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}
        >
          {icon}
        </div>
        <div className="space-y-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <Button variant="outline" className="w-full" onClick={onCta}>
        {cta}
      </Button>
    </CardContent>
  </Card>
);

export const VolunteerPendingCard = () => {
  const router = useRouter();
  return (
    <ShellCard
      icon={<Clock className="h-5 w-5" />}
      iconBg="bg-yellow-100 dark:bg-yellow-950/40"
      iconColor="text-yellow-700 dark:text-yellow-400"
      title="Inscription bénévole en attente"
      description="Votre inscription est en cours d'examen par les organisateurs. Vous serez notifié une fois validée."
      cta="Gérer mon inscription"
      onCta={() => router.push("/volunteer")}
    />
  );
};

export const VolunteerDashboardCard = () => {
  const router = useRouter();
  return (
    <ShellCard
      icon={<CheckCircle2 className="h-5 w-5" />}
      iconBg="bg-green-100 dark:bg-green-950/40"
      iconColor="text-green-700 dark:text-green-400"
      title="Vous êtes bénévole"
      description="Votre inscription bénévole est validée. Merci de votre engagement !"
      cta="Voir mon inscription"
      onCta={() => router.push("/volunteer")}
    />
  );
};

export const VolunteerCancelledCard = () => {
  const router = useRouter();
  return (
    <ShellCard
      icon={<XCircle className="h-5 w-5" />}
      iconBg="bg-destructive/10"
      iconColor="text-destructive"
      title="Inscription bénévole annulée"
      description="Votre inscription bénévole a été annulée."
      cta="Voir les détails"
      onCta={() => router.push("/volunteer")}
    />
  );
};
