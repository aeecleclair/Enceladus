"use client";

import EditionForm from "@/components/challenger/admin/EditionForm";
import {
  EditionFormSchema,
  editionFormSchema,
} from "@/forms/challenger/edition";
import { useEdition } from "@/hooks/challenger/useEdition";
import { useHasChallengerPermission } from "@/hooks/challenger/useHasChallengerPermission";
import { useSports } from "@/hooks/challenger/useSports";
import { useLocations } from "@/hooks/challenger/useLocations";
import { useProducts } from "@/hooks/challenger/useProducts";
import { usePodiums } from "@/hooks/challenger/usePodiums";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMemo } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  ConfigurationStatusCard,
  LocationsCard,
  ProductsCard,
  SportsCard,
  SchoolsCard,
  PaymentStatsCard,
} from "@/components/challenger/admin/home";
import { useSportSchools } from "@/hooks/challenger/useSportSchools";
import { useEditionStats } from "@/hooks/challenger/useEditionStats";
import { useAllMatches } from "@/hooks/challenger/useAllMatches";
import { useAllTeams } from "@/hooks/challenger/useAllTeams";
import { useVolunteerShifts } from "@/hooks/challenger/useVolunteerShifts";

const AdminPage = () => {
  const {
    edition,
    createEdition,
    isCreationLoading,
    openEditionInscription,
    closeEditionInscription,
    isOpenInscriptionLoading,
    isCloseInscriptionLoading,
  } = useEdition();
  const { sportSchools: schools } = useSportSchools();
  const { isChallengerAdmin } = useHasChallengerPermission();
  const { sports } = useSports();
  const { locations } = useLocations();
  const { products } = useProducts();
  const { globalPodium } = usePodiums();
  const { stats: editionStats } = useEditionStats({
    editionId: edition?.id,
  });
  const { allMatches } = useAllMatches();
  const { allTeams } = useAllTeams();
  const { volunteerShifts } = useVolunteerShifts();

  const matchCountBySport = useMemo(() => {
    const map = new Map<string, number>();
    if (!allMatches) return map;
    for (const match of allMatches) {
      map.set(match.sport_id, (map.get(match.sport_id) || 0) + 1);
    }
    return map;
  }, [allMatches]);

  const form = useForm<EditionFormSchema>({
    resolver: zodResolver(editionFormSchema),
    defaultValues: {},
    mode: "onChange",
  });

  const stats = useMemo(() => {
    if (!schools || !sports) {
      return null;
    }

    const totalSchools = schools.length;
    const totalSports = sports.length;
    const totalLocations = locations?.length || 0;
    const totalProducts = products?.length || 0;

    // Calculate total product variants
    const totalVariants =
      products?.reduce(
        (acc, product) => acc + (product.variants?.length || 0),
        0,
      ) || 0;

    // Calculate podium statistics
    const podiumStats = globalPodium
      ? {
          totalRankings: globalPodium.length,
          schoolsWithRankings: new Set(globalPodium.map((p) => p.school_id))
            .size,
        }
      : null;

    return {
      totalSchools,
      totalSports,
      totalLocations,
      totalProducts,
      totalVariants,
      podiumStats,
    };
  }, [schools, sports, locations, products, globalPodium]);

  function onSubmit(values: EditionFormSchema) {
    createEdition(
      {
        name: values.name,
        start_date: values.startDate.toISOString().slice(0, 10),
        end_date: values.endDate.toISOString().slice(0, 10),
        year: values.startDate.getFullYear(),
        active: true,
      },
      () => {
        form.reset();
      },
    );
  }

  return (
    <>
      {isChallengerAdmin && edition === null && (
        <EditionForm
          form={form}
          isLoading={isCreationLoading}
          onSubmit={onSubmit}
          submitLabel="Créer l'édition"
        />
      )}

      {isChallengerAdmin && edition && (
        <div className="space-y-6">
          {/* Header with title and action */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {edition.name}
              </h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>
                    {format(new Date(edition.start_date), "dd MMMM yyyy", {
                      locale: fr,
                    })}{" "}
                    -{" "}
                    {format(new Date(edition.end_date), "dd MMMM yyyy", {
                      locale: fr,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {stats && (
            <>
              {/* Payment & User stats */}
              {editionStats && <PaymentStatsCard stats={editionStats} />}

              {/* Details sections */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <ConfigurationStatusCard
                  edition={edition}
                  podiumStats={stats.podiumStats}
                  sports={sports}
                  schools={schools}
                  locations={locations}
                  products={products}
                  matchCountBySport={matchCountBySport}
                  allTeams={allTeams}
                  volunteerShifts={volunteerShifts}
                  onOpenInscription={openEditionInscription}
                  onCloseInscription={closeEditionInscription}
                  isOpenInscriptionLoading={isOpenInscriptionLoading}
                  isCloseInscriptionLoading={isCloseInscriptionLoading}
                />

                <LocationsCard locations={locations || []} />

                <ProductsCard products={products || []} />
              </div>

              {/* Core entities overview */}
              <div className="grid gap-6 md:grid-cols-2">
                <SportsCard sports={sports || []} />

                <SchoolsCard schools={schools || []} />
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AdminPage;
