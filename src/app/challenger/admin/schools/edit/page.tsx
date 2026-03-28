"use client";

import { useSchools } from "@/src/hooks/useSchools";
import { useSportSchools } from "@/src/hooks/useSportSchools";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/src/components/ui/button";
import { SchoolsForm } from "@/src/components/admin/schools/SchoolsForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { SchoolExtensionEdit } from "@/src/api/hyperionSchemas";
import { schoolFormSchema, SchoolFormValues } from "@/src/forms/schools";
import { ArrowLeft } from "lucide-react";
import { formatSchoolName } from "@/src/utils/schoolFormatting";

const Dashboard = () => {
  const router = useRouter();
  const searchParam = useSearchParams();
  const schoolId = searchParam.get("school_id");

  const { sportSchools } = useSportSchools();

  const school = sportSchools?.find((s) => s.school_id === schoolId);
  const { filteredSchools } = useSchools();
  const { updateCompetitionSchool, isUpdateLoading: isLoading } =
    useSportSchools();

  const noCompetitionSchools = filteredSchools?.filter(
    (school) =>
      !sportSchools?.some((sportSchool) => sportSchool.school_id === school.id),
  );

  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues: {
      schools: school?.school_id,
      fromLyon: school?.from_lyon,
      active: school?.active,
      inscription_enabled: school?.inscription_enabled,
    },
    mode: "onChange",
  });

  function onSubmit(values: SchoolFormValues) {
    const body: SchoolExtensionEdit = {
      from_lyon: values.fromLyon,
      active: values.active,
      inscription_enabled: values.inscription_enabled,
    };
    updateCompetitionSchool(school!.school_id, body, () => {
      form.reset({
        schools: values.schools,
        fromLyon: values.fromLyon,
        active: values.active,
        inscription_enabled: values.inscription_enabled,
      });
    });
  }

  return school ? (
    <div className="flex w-full flex-col space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Modifier une école
          </h1>
          <p className="text-muted-foreground">
            Modifiez les paramètres de l&apos;école{" "}
            {formatSchoolName(school.school.name)}
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
          <CardTitle>Informations de l&apos;école</CardTitle>
        </CardHeader>
        <CardContent>
          <SchoolsForm
            form={form}
            isLoading={isLoading}
            onSubmit={onSubmit}
            submitLabel="Modifier l'école"
            schools={noCompetitionSchools || []}
            isEdit={true}
          />
        </CardContent>
      </Card>
    </div>
  ) : (
    <div>No school with id {schoolId}</div>
  );
};

export default Dashboard;
