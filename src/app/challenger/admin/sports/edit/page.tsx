"use client";

import { useSports } from "@/src/hooks/useSports";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SportsForm } from "@/src/components/admin/sports/SportsForm";
import { SportEdit } from "@/src/api/hyperionSchemas";
import { sportFormSchema, SportFormValues } from "@/src/forms/sport";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { ArrowLeft, Edit, Trophy } from "lucide-react";

const EditSportPage = () => {
  const router = useRouter();
  const searchParam = useSearchParams();
  const sportId = searchParam.get("sport_id");

  const { sports, updateSport, isUpdateLoading: isLoading } = useSports();

  const sport = sports?.find((s) => s.id === sportId);

  const form = useForm<SportFormValues>({
    resolver: zodResolver(sportFormSchema),
    defaultValues: {
      name: sport?.name || "",
      teamSize: sport?.team_size || 1,
      sportCategory: sport?.sport_category || "masculine",
      substituteMax: sport?.substitute_max || 0,
      active: sport?.active !== undefined ? sport.active : true,
    },
    mode: "onChange",
  });

  function onSubmit(values: SportFormValues) {
    if (!sportId) return;

    const body: SportEdit = {
      name: values.name,
      team_size: values.teamSize,
      sport_category:
        values.sportCategory === "null" ? null : values.sportCategory,
      substitute_max: values.substituteMax,
      active: values.active,
    };

    updateSport(sportId, body, () => {
      form.reset();
      router.push("/admin/sports");
    });
  }

  return sport ? (
    <div className="flex w-full flex-col space-y-6">
      {/* Header with breadcrumb-style navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Trophy className="h-8 w-8" />
            Modifier un sport
          </h1>
          <p className="text-muted-foreground">
            Modifiez les paramètres du sport {sport.name}
          </p>
        </div>
        <Button variant="outline" asChild className="gap-2">
          <Link href="/admin/sports">
            <ArrowLeft className="h-4 w-4" />
            Retour à la liste
          </Link>
        </Button>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Informations du sport
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SportsForm
            form={form}
            isLoading={isLoading}
            onSubmit={onSubmit}
            submitLabel="Modifier le sport"
          />
        </CardContent>
      </Card>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">Sport introuvable</h3>
      <p className="text-muted-foreground mb-4">
        Aucun sport trouvé avec l&apos;ID {sportId}
      </p>
      <Button asChild className="gap-2">
        <Link href="/admin/sports">
          <ArrowLeft className="h-4 w-4" />
          Retour à la liste
        </Link>
      </Button>
    </div>
  );
};

export default EditSportPage;
