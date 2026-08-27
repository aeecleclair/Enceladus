"use client";

import { LoadingButton } from "@/components/common/LoadingButton";
import { UserShell } from "@/components/raid/home/UserShell";
import { useDocument } from "@/hooks/raid/useDocument";
import { useEdition } from "@/hooks/raid/useEdition";
import { useInformation } from "@/hooks/raid/useInformation";
import { formatDateRange, getDaysLeft } from "@/lib/dateFormat";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

import {
  BookOpen,
  Calendar,
  FileDown,
  Info,
  LifeBuoy,
  Mail,
} from "lucide-react";

const InfoPage = () => {
  const { edition } = useEdition();
  const { information } = useInformation();
  const { refetch, setDocumentId } = useDocument();
  const { toast } = useToast();
  const [loadingDoc, setLoadingDoc] = useState<string | null>(null);

  const downloadDocument = async (
    documentId: string,
    filename: string,
    key: string,
  ) => {
    setLoadingDoc(key);
    setDocumentId(documentId);
    try {
      const response = await refetch();
      const data = response.data as File | undefined;
      if (!data) {
        toast({
          title: "Erreur",
          description: "Impossible de télécharger le fichier",
          variant: "destructive",
        });
        return;
      }
      const extension = data.type.split("/")[1] ?? "pdf";
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${filename}.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      setLoadingDoc(null);
    }
  };

  const datesLabel =
    edition?.start_date && edition?.end_date
      ? formatDateRange(edition.start_date, edition.end_date)
      : null;
  const registeringDaysLeft = edition?.registering_end_date
    ? getDaysLeft(edition.registering_end_date)
    : null;

  const president = information?.president;
  const security = information?.security_responsible;
  const rescue = information?.rescue;
  const volunteerResponsible = information?.volunteer_responsible;

  const emergencyContacts = [
    { role: "Responsable", person: president },
    { role: "Responsable bénévoles", person: volunteerResponsible },
    { role: "Responsable sécurité", person: security },
    { role: "Secours", person: rescue },
  ].filter((c) => c.person);

  return (
    <UserShell>
      <section className="rounded-2xl border border-border/70 bg-card/85 p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-700 dark:text-sky-400">
            <Info className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Informations du Raid
            </h1>
            <p className="text-sm text-muted-foreground">
              Dates, contacts et documents officiels de l&apos;édition en cours.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        <Card className="border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Édition</span>
              <span className="font-medium">
                {edition ? `${edition.name} — ${edition.year}` : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Week-end du Raid</span>
              <span className="font-medium">{datesLabel ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Fin des inscriptions
              </span>
              <span className="font-medium">
                {registeringDaysLeft === null
                  ? "—"
                  : registeringDaysLeft < 0
                    ? "Fermées"
                    : registeringDaysLeft === 0
                      ? "Aujourd'hui"
                      : `Dans ${registeringDaysLeft} jour${registeringDaysLeft > 1 ? "s" : ""}`}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="h-4 w-4 text-sky-600 dark:text-sky-400" />
              Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {information?.contact ? (
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Email</span>
                <a
                  href={`mailto:${information.contact}`}
                  className="font-medium text-primary hover:underline"
                >
                  {information.contact}
                </a>
              </div>
            ) : (
              <p className="text-muted-foreground">Aucun contact renseigné.</p>
            )}
            {emergencyContacts.length > 0 && (
              <div className="border-t border-border/60 pt-3 space-y-2">
                {emergencyContacts.map(({ role, person }) => (
                  <div key={role} className="flex justify-between">
                    <span className="text-muted-foreground">{role}</span>
                    <span className="font-medium">
                      {person?.firstname} {person?.name}
                      {person?.phone ? ` — ${person.phone}` : ""}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/70 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            Documents
          </CardTitle>
          <CardDescription>
            Téléchargez le règlement et les informations pratiques.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {information?.raid_rules_id ? (
            <LoadingButton
              variant="outline"
              isLoading={loadingDoc === "rules"}
              onClick={() =>
                downloadDocument(
                  information.raid_rules_id!,
                  "Reglement_Raid",
                  "rules",
                )
              }
              className="justify-start"
            >
              <LifeBuoy className="mr-2 h-4 w-4" />
              Règlement du Raid
              <FileDown className="ml-auto h-4 w-4 text-muted-foreground" />
            </LoadingButton>
          ) : (
            <Button variant="outline" disabled className="justify-start">
              <LifeBuoy className="mr-2 h-4 w-4" />
              Règlement indisponible
            </Button>
          )}
          {information?.raid_information_id ? (
            <LoadingButton
              variant="outline"
              isLoading={loadingDoc === "info"}
              onClick={() =>
                downloadDocument(
                  information.raid_information_id!,
                  "Informations_Raid",
                  "info",
                )
              }
              className="justify-start"
            >
              <Info className="mr-2 h-4 w-4" />
              Guide du Raid
              <FileDown className="ml-auto h-4 w-4 text-muted-foreground" />
            </LoadingButton>
          ) : (
            <Button variant="outline" disabled className="justify-start">
              <Info className="mr-2 h-4 w-4" />
              Guide indisponible
            </Button>
          )}
        </CardContent>
      </Card>
    </UserShell>
  );
};

export default InfoPage;
