"use client";
import { useRouter } from "@/i18n/navigation";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  const t = useTranslations("raid.home.dashboard.volunteerPending");
  const router = useRouter();
  return (
    <ShellCard
      icon={<Clock className="h-5 w-5" />}
      iconBg="bg-yellow-100 dark:bg-yellow-950/40"
      iconColor="text-yellow-700 dark:text-yellow-400"
      title={t("title")}
      description={t("fullDescription")}
      cta={t("cta")}
      onCta={() => router.push("/volunteer")}
    />
  );
};

export const VolunteerDashboardCard = () => {
  const t = useTranslations("raid.home.dashboard.volunteerDashboard");
  const router = useRouter();
  return (
    <ShellCard
      icon={<CheckCircle2 className="h-5 w-5" />}
      iconBg="bg-green-100 dark:bg-green-950/40"
      iconColor="text-green-700 dark:text-green-400"
      title={t("title")}
      description={t("description")}
      cta={t("cta")}
      onCta={() => router.push("/volunteer")}
    />
  );
};

export const CancelledRegistrationCard = () => {
  const t = useTranslations("raid.home.dashboard.volunteerCancelled");
  const router = useRouter();
  return (
    <Card className="mx-auto w-full max-w-3xl border-border/70 bg-card/90 shadow-sm">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
            <XCircle className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 sm:flex-row">
        <Button
          className="w-full sm:flex-1"
          onClick={() => router.push("/register")}
        >
          {t("cta")}
        </Button>
        <Button
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => router.push("/volunteer")}
        >
          {t("ctaSecondary")}
        </Button>
      </CardContent>
    </Card>
  );
};
