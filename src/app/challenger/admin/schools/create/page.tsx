"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { schoolFormSchema, SchoolFormValues } from "@/src/forms/schools";
import { useSchools } from "@/src/hooks/useSchools";
import { useSportSchools } from "@/src/hooks/useSportSchools";
import { SchoolsForm } from "@/src/components/admin/schools/SchoolsForm";
import { SchoolExtensionBase } from "@/src/api/hyperionSchemas";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { ArrowLeft, Plus, School } from "lucide-react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();
  const { filteredSchools } = useSchools();
  const { sportSchools } = useSportSchools();
  const { createCompetitionSchool, isLoading } = useSportSchools();
  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {
      fromLyon: false,
      active: true,
      inscription_enabled: false,
    },
    mode: "onChange",
  });

  const noCompetitionSchools = filteredSchools?.filter(
    (school) =>
      !sportSchools?.some((sportSchool) => sportSchool.school_id === school.id),
  );

  function onSubmit(values: SchoolFormValues) {
    const body: SchoolExtensionBase = {
      school_id: values.schools,
      from_lyon: values.fromLyon,
      active: values.active,
      inscription_enabled: values.inscription_enabled,
    };
    createCompetitionSchool(body, () => {
      form.reset();
      router.push("/admin/schools");
    });
  }

  return (
    <div className="flex h-full w-full flex-col space-y-6">
      {/* Header with breadcrumb-style navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <School className="h-8 w-8" />
            Ajouter une école
          </h1>
          <p className="text-muted-foreground">
            Configurez une nouvelle école pour la compétition
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => router.push("/admin/schools")}
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la liste
        </Button>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Configuration de l&apos;école
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SchoolsForm
            form={form}
            isLoading={isLoading}
            onSubmit={onSubmit}
            submitLabel="Ajouter l'école"
            schools={noCompetitionSchools || []}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
