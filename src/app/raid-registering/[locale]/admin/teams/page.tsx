"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/raid/admin/teams/DataTable";
import { columns } from "@/components/raid/admin/teams/Columns";
import { PageHeader } from "@/components/raid/admin/PageHeader";
import { useTeams } from "@/hooks/raid/useTeams";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { TeamSheet } from "@/components/raid/admin/teams/teamSheet/TeamSheet";
import { useRouter } from "@/i18n/navigation";
import { UsersRound } from "lucide-react";

const TeamsAdminPage = () => {
  const { teams } = useTeams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpened, setIsOpened] = useState(false);
  const [teamId, setTeamId] = useState<string | null>(null);

  const selectedTeamId = searchParams.get("teamId");
  useEffect(() => {
    if (selectedTeamId !== teamId) {
      setTeamId(selectedTeamId);
      setIsOpened(!!selectedTeamId);
    }
  }, [selectedTeamId, teamId]);

  function handleModalClose() {
    setIsOpened(false);
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.delete("teamId");
    const query = current.toString();
    router.replace(query ? `/admin/teams?${query}` : "/admin/teams");
    setTeamId(null);
  }

  return (
    <>
      <PageHeader
        icon={UsersRound}
        title="Équipes"
        description="Consultez les équipes et ouvrez le détail d'un dossier."
        accent="emerald"
      />
      <Card className="border-border/70 bg-card/95 shadow-sm">
        <CardHeader>
          <CardTitle>Liste des équipes</CardTitle>
          <CardDescription>
            {teams ? `${teams.length} équipe${teams.length > 1 ? "s" : ""} enregistrée${teams.length > 1 ? "s" : ""}` : "Chargement…"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {teams && <DataTable data={teams} columns={columns} />}
        </CardContent>
      </Card>
      {teamId && (
        <TeamSheet
          isOpened={isOpened}
          onClose={handleModalClose}
          teamId={teamId}
        />
      )}
    </>
  );
};

export default TeamsAdminPage;
