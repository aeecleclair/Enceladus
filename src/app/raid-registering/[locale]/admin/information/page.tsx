"use client";

import { ContactMail } from "@/components/raid/admin/information/ContactMail";
import { EmergencyPerson } from "@/components/raid/admin/information/EmergencyPersons";
import { RaidDate } from "@/components/raid/admin/information/RaidDate";
import { RaidInformationDocument } from "@/components/raid/admin/information/RaidInformationDocument";
import { RaidStudentPrice } from "@/components/raid/admin/information/RaidStudentPrice";
import { RaidRules } from "@/components/raid/admin/information/RaidRules";
import { TShirtPrice } from "@/components/raid/admin/information/TShirtPrice";
import { RaidExternalPrice } from "@/components/raid/admin/information/RaidExternalPrice";
import { RaidPartnerPrice } from "@/components/raid/admin/information/RaidPartnerPrice";
import { CardLayout } from "@/components/raid/admin/information/CardLayout";
import { InfoValue } from "@/components/raid/admin/information/InfoValue";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useInformation } from "@/hooks/raid/useInformation";
import { useEdition } from "@/hooks/raid/useEdition";
import { formatDate } from "@/lib/dateFormat";
import { useRouter } from "@/i18n/navigation";
import {
  BookOpen,
  CalendarRange,
  Euro,
  Info,
  Phone,
  Settings2,
} from "lucide-react";
import { PageHeader } from "@/components/raid/admin/PageHeader";
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
  const { edition } = useEdition();
  const router = useRouter();

  return (
    <div className="space-y-5">
      <PageHeader
        icon={Settings2}
        title="Informations Raid"
        description="Configurez dates, tarifs, contact et documents visibles pendant les inscriptions."
        accent="sky"
      />

      <SectionCard
        icon={CalendarRange}
        iconAccent="bg-amber-500/15 text-amber-700 dark:text-amber-400"
        title="Dates"
        description="Période du Raid et clôture des inscriptions."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <CardLayout
            label="Fin des inscriptions"
            description="Gérée via l'édition active."
          >
            <InfoValue
              isEmpty={!edition?.registering_end_date}
              placeholder="Non renseignée"
              value={
                edition?.registering_end_date
                  ? formatDate(edition.registering_end_date)
                  : ""
              }
            />
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => router.push("/admin/editions")}
            >
              Modifier dans les éditions
            </Button>
          </CardLayout>
          <RaidDate />
        </div>
      </SectionCard>

      <SectionCard
        icon={Euro}
        iconAccent="bg-violet-500/15 text-violet-700 dark:text-violet-400"
        title="Tarifs"
        description="Grille de prix pour les différents profils et options."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <RaidStudentPrice />
          <RaidExternalPrice />
          <RaidPartnerPrice />
          <TShirtPrice />
        </div>
      </SectionCard>

      <SectionCard
        icon={Phone}
        iconAccent="bg-sky-500/15 text-sky-700 dark:text-sky-400"
        title="Contact"
        description="Email public et contacts d'urgence."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <ContactMail />
          <EmergencyPerson />
        </div>
      </SectionCard>

      <SectionCard
        icon={BookOpen}
        iconAccent="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
        title="Fichiers"
        description="Règlement et fiche d'information distribués aux participants."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {information ? (
            <>
              <RaidRules information={information} />
              <RaidInformationDocument information={information} />
            </>
          ) : (
            <>
              <CardLayout label="Règlement du Raid">
                <InfoValue isEmpty placeholder="Chargement…" value="" />
              </CardLayout>
              <CardLayout label="Fiche d'information">
                <InfoValue isEmpty placeholder="Chargement…" value="" />
              </CardLayout>
            </>
          )}
        </div>
      </SectionCard>

      <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/10 p-3 text-xs text-muted-foreground">
        <Info className="h-3.5 w-3.5 shrink-0" />
        Les modifications sont enregistrées immédiatement sur l&apos;édition
        active.
      </div>
    </div>
  );
};

export default InformationPage;
