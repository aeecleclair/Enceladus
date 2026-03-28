"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { sportFormSchema, SportFormValues } from "@/src/forms/sport";
import { useSports } from "@/src/hooks/useSports";
import { SportsForm } from "@/src/components/admin/sports/SportsForm";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { ArrowLeft, Plus, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import { SportBase } from "@/src/api/hyperionSchemas";

const Dashboard = () => {
  const router = useRouter();
  const { createSport, isCreateLoading: isLoading } = useSports();

  const form = useForm<SportFormValues>({
    resolver: zodResolver(sportFormSchema),
    defaultValues: {
      name: "",
      teamSize: 1,
      sportCategory: "masculine",
      substituteMax: 0,
      active: true,
    },
    mode: "onChange",
  });

  function onSubmit(values: SportFormValues) {
    const body: SportBase = {
      name: values.name,
      team_size: values.teamSize,
      sport_category:
        values.sportCategory === "null" ? null : values.sportCategory,
      substitute_max: values.substituteMax,
      active: values.active,
    };
    createSport(body, () => {
      form.reset();
      router.push("/admin/sports");
    });
  }

  return (
    <div className="flex h-full w-full flex-col space-y-6">
      {/* Header with breadcrumb-style navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Trophy className="h-8 w-8" />
            Ajouter un sport
          </h1>
          <p className="text-muted-foreground">
            Configurez un nouveau sport pour la compétition
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
            <Plus className="h-5 w-5" />
            Configuration du sport
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SportsForm
            form={form}
            isLoading={isLoading}
            onSubmit={onSubmit}
            submitLabel="Ajouter le sport"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
