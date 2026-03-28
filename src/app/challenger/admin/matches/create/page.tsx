"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSportMatches } from "@/src/hooks/useSportMatches";
import { MatchFormValues, matchFormSchema } from "@/src/forms/match";
import { MatchesForm } from "@/src/components/admin/matches/MatchesForm";
import { MatchBase } from "@/src/api/hyperionSchemas";

const CreateMatchPage = () => {
  const router = useRouter();
  const searchParam = useSearchParams();
  const sportIdParam = searchParam.get("sport_id");

  const [selectedSportId, setSelectedSportId] = useState<string>(
    sportIdParam || "",
  );

  const { createMatch, isCreateLoading } = useSportMatches({
    sportId: selectedSportId || undefined,
  });

  const form = useForm<MatchFormValues>({
    resolver: zodResolver(matchFormSchema),
    defaultValues: {
      name: "",
      sport_id: selectedSportId || "",
      team1_id: "",
      team2_id: "",
      date: undefined,
      location_id: "",
      score_team1: undefined,
      score_team2: undefined,
      winner_id: undefined,
      edition_id: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (selectedSportId) {
      form.setValue("sport_id", selectedSportId);
    }
  }, [selectedSportId, form]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.sport_id && value.sport_id !== selectedSportId) {
        setSelectedSportId(value.sport_id);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, selectedSportId]);

  function onSubmit(values: MatchFormValues) {
    const sportIdToUse = values.sport_id || selectedSportId;
    if (!sportIdToUse) {
      return;
    }

    const matchData: MatchBase = {
      name: values.name,
      team1_id: values.team1_id,
      team2_id: values.team2_id,
      date: values.date.toISOString(),
      location_id: values.location_id,
      score_team1: values.score_team1 || null,
      score_team2: values.score_team2 || null,
      winner_id: values.winner_id || null,
      ended: false,
    };

    createMatch(matchData, () => {
      const params = new URLSearchParams();
      if (sportIdToUse) {
        params.set("sport_id", sportIdToUse);
      }
      router.push(`/admin/matches?${params.toString()}`);
    });
  }

  return (
    <div className="flex w-full flex-col min-h-screen">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Créer un nouveau match
            </h1>
            <p className="text-gray-600 mt-1">
              Configurez les détails du match et sélectionnez les équipes
              participantes
            </p>
          </div>
          <Link
            href={`/admin/matches${sportIdParam ? `?sport_id=${sportIdParam}` : ""}`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            ← Retour à la liste
          </Link>
        </div>

        <MatchesForm
          form={form}
          onSubmit={onSubmit}
          isLoading={isCreateLoading}
          submitLabel="Créer le match"
          onSportChange={setSelectedSportId}
        />
      </div>
    </div>
  );
};

export default CreateMatchPage;
