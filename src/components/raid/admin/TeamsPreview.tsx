import { RaidParticipant, RaidTeamPreview } from "@/api";
import { ProgressBadge } from "@/components/raid/custom/ProgressBadge";
import { useSecurityFiles } from "@/hooks/raid/useSecurityFiles";
import { useTeamFiles } from "@/hooks/raid/useTeamFiles";
import { useRouter } from "@/i18n/navigation";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ArrowUpRight, DownloadIcon, LifeBuoyIcon } from "lucide-react";
import { UsersIcon } from "lucide-react";

interface TeamsPreviewProps {
  teams?: RaidTeamPreview[];
  isLoading: boolean;
}

export const TeamsPreview = ({ teams, isLoading }: TeamsPreviewProps) => {
  function downloadBlob(blob: Blob, prefix: string) {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    const formatted = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate(),
    )}_${pad(now.getHours())}_${pad(now.getMinutes())}_${pad(
      now.getSeconds(),
    )}`;
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${prefix}_${formatted}.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refetchTeamFiles, isLoading: isTeamFilesLoading } = useTeamFiles();
  const { refetchSecurityFiles, isLoading: isSecurityFilesLoading } =
    useSecurityFiles();

  function onTeamClick(teamId: string) {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("teamId", teamId);
    const query = current.toString();
    router.replace(`/admin/teams?${query}`);
  }

  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Equipes</CardTitle>
          <CardDescription>
            Aperçu des {teams?.slice(0, 5).length ?? 0} équipes les plus proches
            de la validation de leur dossier
          </CardDescription>
        </div>
        <div className="flex gap-2 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="gap-1">
                <DownloadIcon className="h-4 w-4 mr-1" />
                Documents
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                disabled={isTeamFilesLoading}
                onClick={() => {
                  refetchTeamFiles().then((response) => {
                    const teamFiles = response.data;
                    if (teamFiles instanceof Blob) {
                      downloadBlob(teamFiles, "Dossiers_Equipes");
                    }
                  });
                }}
              >
                <UsersIcon className="mr-2 h-4 w-4 " />
                Fichiers équipes
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={isSecurityFilesLoading}
                onClick={() => {
                  refetchSecurityFiles().then((response) => {
                    const securityFiles = response.data;
                    if (securityFiles instanceof Blob) {
                      downloadBlob(securityFiles, "Fiches_Sécurités");
                    }
                  });
                }}
              >
                <LifeBuoyIcon className="mr-2 h-4 w-4 " />
                Fiches sécurité
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button asChild size="sm" className="gap-1">
            <Link href="/admin/teams">
              Voir tout
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead className="max-md:hidden">Capitaine</TableHead>
              <TableHead className="max-md:hidden">Coéquipier</TableHead>
              <TableHead className="max-md:hidden">Documents</TableHead>
              <TableHead className="text-right">Inscription</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="h-19.5">
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                    {[...Array(3)].map((_, index) => (
                      <TableCell key={index} className="max-md:hidden">
                        <Skeleton className="h-6 w-24" />
                      </TableCell>
                    ))}
                    <TableCell>
                      <Skeleton className="h-6 w-8 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}
            {teams && (
              <>
                {teams
                  .toSorted(
                    (a, b) =>
                      (b.validation_progress % 100) -
                      (a.validation_progress % 100),
                  )
                  .slice(0, 5)
                  .map((team) => {
                    const captain = team.captain as RaidParticipant;
                    const second = team.second as RaidParticipant | null;
                    const number_of_validated_document =
                      captain.number_of_validated_document +
                      (second?.number_of_validated_document ?? 0);
                    const number_of_document =
                      captain.number_of_document +
                      (second?.number_of_document ?? 0);
                    return (
                      <TableRow
                        key={team.id}
                        onClick={() => onTeamClick(team.id)}
                      >
                        <TableCell className="h-19.5">{team.name}</TableCell>
                        <TableCell className="max-md:hidden">
                          <div className="font-medium">
                            {team.captain?.user?.firstname}{" "}
                            {team.captain?.user?.name}
                          </div>
                        </TableCell>
                        <TableCell className="max-md:hidden">
                          {team.second ? (
                            <>
                              <div className="font-medium">
                                {team.second.user.firstname}{" "}
                                {team.second.user.name}
                              </div>
                            </>
                          ) : (
                            <div className="font-medium text-muted-foreground">
                              Non renseigné
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="max-md:hidden">
                          <ProgressBadge
                            progress={number_of_validated_document}
                            total={number_of_document}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          {team?.validation_progress.toFixed(0)}%
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
