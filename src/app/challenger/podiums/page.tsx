"use client";

import { useSports } from "@/src/hooks/useSports";
import { useSchools } from "@/src/hooks/useSchools";
import { usePompomsPodiums } from "@/src/hooks/usePompomsPodiums";
import { useSportPodiums } from "@/src/hooks/useSportsPodiums";
import { usePodiums } from "@/src/hooks/usePodiums";
import { SportsDataTable } from "@/src/components/podiums/SportsDataTable";
import { GlobalPodiumCard } from "@/src/components/podiums/GlobalPodiumCard";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/src/components/ui/sidebar";
import { AppSidebar } from "@/src/components/home/appSideBar/AppSidebar";

export default function PodiumsPage() {
  const { sports, error: sportsError } = useSports();
  const { schools } = useSchools();
  const { pompomsResults, isPompomsLoading } = usePompomsPodiums();
  const { podiumsBySport } = useSportPodiums({
    sportIds:
      sports?.filter((sport) => sport.active).map((sport) => sport.id) || [],
  });
  const { globalPodium, isGlobalLoading } = usePodiums();

  if (sportsError) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
            </div>
          </header>
          <div className="flex flex-col relative overflow-auto h-full m-6">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-destructive mb-2">
                Erreur de chargement des sports
              </h2>
              <p className="text-muted-foreground">
                Impossible de charger les sports. Vérifiez votre connexion ou
                contactez l&apos;administration.
              </p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // Helper function to get school name by ID
  const getSchoolName = (schoolId: string) => {
    const school = schools?.find((s) => s.id === schoolId);
    return school?.name || "École inconnue";
  };

  // Prepare data for the unified table
  const tableData = [
    // Add Pompoms as first entry
    {
      id: "pompoms",
      name: "Pompoms",
      active: true,
      firstPlace: pompomsResults?.sort(
        (a, b) => b.total_points - a.total_points,
      )[0]
        ? getSchoolName(
            pompomsResults.sort((a, b) => b.total_points - a.total_points)[0]
              .school_id,
          )
        : null,
      secondPlace: pompomsResults?.sort(
        (a, b) => b.total_points - a.total_points,
      )[1]
        ? getSchoolName(
            pompomsResults.sort((a, b) => b.total_points - a.total_points)[1]
              .school_id,
          )
        : null,
      thirdPlace: pompomsResults?.sort(
        (a, b) => b.total_points - a.total_points,
      )[2]
        ? getSchoolName(
            pompomsResults.sort((a, b) => b.total_points - a.total_points)[2]
              .school_id,
          )
        : null,
      // Transform pompoms results to match the expected format for the table
      others:
        pompomsResults
          ?.sort((a, b) => b.total_points - a.total_points)
          .map((result, index) => ({
            school_id: result.school_id,
            sport_id: "pompoms",
            team_id: result.school_id,
            points: result.total_points,
            edition_id: "",
            rank: index + 1,
            team: {
              id: result.school_id,
              name: getSchoolName(result.school_id),
              captain_id: "",
              sport_id: "pompoms",
              school_id: result.school_id,
              edition_id: "",
              created_at: new Date().toISOString(),
            },
          })) || [],
    },
    // Add regular sports
    ...(sports
      ?.filter((sport) => sport.active)
      .map((sport) => {
        const podiumData = podiumsBySport[sport.id];
        const sortedPodium = podiumData
          ? [...podiumData].sort((a, b) => a.rank - b.rank)
          : [];

        return {
          id: sport.id,
          name: sport.name,
          active: sport.active ?? true,
          firstPlace:
            sortedPodium.find((p) => p.rank === 1)?.team?.name || null,
          secondPlace:
            sortedPodium.find((p) => p.rank === 2)?.team?.name || null,
          thirdPlace:
            sortedPodium.find((p) => p.rank === 3)?.team?.name || null,
          others: sortedPodium,
        };
      }) || []),
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <div className="flex flex-col relative overflow-auto h-full m-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Podiums</h1>
            </div>

            {/* Global Podium Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Podium Global</h2>
              {isGlobalLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Chargement du podium global...
                </div>
              ) : (
                <GlobalPodiumCard
                  results={globalPodium || []}
                  title="Classement général des écoles"
                />
              )}
            </div>

            {/* Sports Podiums Table */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Podiums par sport</h2>
              <SportsDataTable data={tableData} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
