"use client";

import { PageHeader } from "@/components/raid/admin/PageHeader";
import { CardLayout } from "@/components/raid/admin/information/CardLayout";
import { ContactMail } from "@/components/raid/admin/information/ContactMail";
import { EmergencyPerson } from "@/components/raid/admin/information/EmergencyPersons";
import { InfoValue } from "@/components/raid/admin/information/InfoValue";
import { InscriptionEndDate } from "@/components/raid/admin/information/InscriptionEndDate";
import { RaidDate } from "@/components/raid/admin/information/RaidDate";
import { RaidExternalPrice } from "@/components/raid/admin/information/RaidExternalPrice";
import { RaidInformationDocument } from "@/components/raid/admin/information/RaidInformationDocument";
import { RaidPartnerPrice } from "@/components/raid/admin/information/RaidPartnerPrice";
import { RaidRules } from "@/components/raid/admin/information/RaidRules";
import { RaidStudentPrice } from "@/components/raid/admin/information/RaidStudentPrice";
import { RaidVolunteerPrice } from "@/components/raid/admin/information/RaidVolunteerPrice";
import { TShirtPrice } from "@/components/raid/admin/information/TShirtPrice";
import { useInformation } from "@/hooks/raid/useInformation";

import { useTranslations } from "next-intl";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  BookOpen,
  CalendarRange,
  Euro,
  Info,
  Phone,
  Settings2,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

const SectionCard = ({
  icon: Icon,
  iconAccent,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  iconAccent: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <Card className="border-border/70 bg-card/95 shadow-sm">
    <CardHeader className="border-b border-border/60 bg-muted/10">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconAccent}`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="space-y-0.5">
          <CardTitle className="text-base">{title}</CardTitle>
          {description && (
            <CardDescription className="text-xs">{description}</CardDescription>
          )}
        </div>
      </div>
    </CardHeader>
    <CardContent className="pt-5">{children}</CardContent>
  </Card>
);

const InformationPage = () => {
  const { information } = useInformation();
  const t = useTranslations("raid.admin.information");

  return (
    <div className="space-y-5">
      <PageHeader
        icon={Settings2}
        title={t("title")}
        description={t("subtitle")}
        accent="sky"
      />

      <SectionCard
        icon={CalendarRange}
        iconAccent="bg-amber-500/15 text-amber-700 dark:text-amber-400"
        title={t("sections.dates")}
        description={t("sections.datesDescription")}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <RaidDate />
          <InscriptionEndDate />
        </div>
      </SectionCard>

      <SectionCard
        icon={Euro}
        iconAccent="bg-violet-500/15 text-violet-700 dark:text-violet-400"
        title={t("sections.prices")}
        description={t("sections.pricesDescription")}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <RaidStudentPrice />
          <RaidExternalPrice />
          <RaidPartnerPrice />
          <RaidVolunteerPrice />
          <TShirtPrice />
        </div>
      </SectionCard>

      <SectionCard
        icon={Phone}
        iconAccent="bg-sky-500/15 text-sky-700 dark:text-sky-400"
        title={t("sections.contact")}
        description={t("sections.contactDescription")}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <ContactMail />
          <EmergencyPerson />
        </div>
      </SectionCard>

      <SectionCard
        icon={BookOpen}
        iconAccent="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
        title={t("sections.files")}
        description={t("sections.filesDescription")}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {information ? (
            <>
              <RaidRules information={information} />
              <RaidInformationDocument information={information} />
            </>
          ) : (
            <>
              <CardLayout label={t("rulesLabel")}>
                <InfoValue isEmpty placeholder={t("loading")} value="" />
              </CardLayout>
              <CardLayout label={t("infoLabel")}>
                <InfoValue isEmpty placeholder={t("loading")} value="" />
              </CardLayout>
            </>
          )}
        </div>
      </SectionCard>

      <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/10 p-3 text-xs text-muted-foreground">
        <Info className="h-3.5 w-3.5 shrink-0" />
        {t("footerNotice")}
      </div>
    </div>
  );
};

export default InformationPage;
