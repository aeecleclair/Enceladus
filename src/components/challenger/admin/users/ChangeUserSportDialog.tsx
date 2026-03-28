import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { LoadingButton } from "../../custom/LoadingButton";
import { useSports } from "@/src/hooks/useSports";
import { useSportTeams } from "@/src/hooks/useSportTeams";
import { useChangeParticipantSport } from "@/src/hooks/useChangeParticipantSport";
import { useCreateTeam } from "@/src/hooks/useCreateTeam";
import { ChevronRight } from "lucide-react";

interface ChangeUserSportDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
  currentSportId: string;
  schoolId: string;
}

type Step = "select-sport" | "select-team" | "confirm";

export const ChangeUserSportDialog = ({
  open,
  onClose,
  onSuccess,
  userId,
  currentSportId,
  schoolId,
}: ChangeUserSportDialogProps) => {
  const { sports } = useSports();

  const [step, setStep] = useState<Step>("select-sport");
  const [selectedSportId, setSelectedSportId] = useState<string>("");
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [createTeamMode, setCreateTeamMode] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");

  const { sportTeams, refetchTeams } = useSportTeams({
    sportId: selectedSportId || undefined,
  });

  const selectedSport = useMemo(
    () => sports?.find((s) => s.id === selectedSportId),
    [sports, selectedSportId],
  );

  const isTeamSport = (selectedSport?.team_size ?? 1) > 1;

  const { changeParticipantSport, isChangeLoading } =
    useChangeParticipantSport();
  const { createTeam, isCreateTeamLoading } = useCreateTeam();

  const handleNextFromSport = () => {
    if (!selectedSportId) return;
    if (isTeamSport) {
      setStep("select-team");
    } else {
      setStep("confirm");
    }
  };

  const handleConfirm = () => {
    const doChange = (teamId?: string) => {
      changeParticipantSport(
        currentSportId,
        userId,
        { sport_id: selectedSportId, team_id: teamId ?? null },
        () => {
          handleClose();
          onSuccess();
        },
      );
    };

    if (isTeamSport && createTeamMode && newTeamName.trim()) {
      createTeam(
        {
          name: newTeamName.trim(),
          sport_id: selectedSportId,
          school_id: schoolId,
          captain_id: userId,
        },
        (teamId) => {
          refetchTeams();
          doChange(teamId);
        },
      );
    } else {
      doChange(isTeamSport ? selectedTeamId : undefined);
    }
  };

  const handleClose = () => {
    setStep("select-sport");
    setSelectedSportId("");
    setSelectedTeamId("");
    setCreateTeamMode(false);
    setNewTeamName("");
    onClose();
  };

  const isLoading = isChangeLoading || isCreateTeamLoading;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Changer de sport</DialogTitle>
        </DialogHeader>

        {/* Step breadcrumb */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
          <span
            className={
              step === "select-sport" ? "font-semibold text-primary" : ""
            }
          >
            Sport
          </span>
          {isTeamSport && (
            <>
              <ChevronRight className="h-3 w-3" />
              <span
                className={
                  step === "select-team" ? "font-semibold text-primary" : ""
                }
              >
                Équipe
              </span>
            </>
          )}
          <ChevronRight className="h-3 w-3" />
          <span
            className={step === "confirm" ? "font-semibold text-primary" : ""}
          >
            Confirmation
          </span>
        </div>

        {step === "select-sport" && (
          <div className="space-y-4">
            <div>
              <Label>Nouveau sport</Label>
              <Select
                value={selectedSportId}
                onValueChange={(val) => {
                  setSelectedSportId(val);
                  setSelectedTeamId("");
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Sélectionner un sport" />
                </SelectTrigger>
                <SelectContent>
                  {sports
                    ?.filter(
                      (s) => s.id !== currentSportId && s.active !== false,
                    )
                    .map((sport) => (
                      <SelectItem key={sport.id} value={sport.id}>
                        {sport.name}
                        {(sport.team_size ?? 1) > 1 ? " (équipe)" : ""}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === "select-team" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              <strong>{selectedSport?.name}</strong> est un sport en équipe.
              Sélectionnez ou créez une équipe.
            </p>
            {!createTeamMode ? (
              <div>
                <Label>Équipe existante</Label>
                <Select
                  value={selectedTeamId}
                  onValueChange={setSelectedTeamId}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sélectionner une équipe" />
                  </SelectTrigger>
                  <SelectContent>
                    {sportTeams?.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 mt-2 h-auto"
                  onClick={() => setCreateTeamMode(true)}
                >
                  + Créer une nouvelle équipe
                </Button>
              </div>
            ) : (
              <div>
                <Label>Nom de la nouvelle équipe</Label>
                <Input
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="Ex: Centrale Basket A"
                  className="mt-1"
                />
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 mt-2 h-auto"
                  onClick={() => {
                    setCreateTeamMode(false);
                    setNewTeamName("");
                  }}
                >
                  ← Utiliser une équipe existante
                </Button>
              </div>
            )}
          </div>
        )}

        {step === "confirm" && (
          <div className="rounded-lg bg-muted/40 p-4 text-sm space-y-2">
            <p>
              <span className="text-muted-foreground">Nouveau sport :</span>{" "}
              <strong>{selectedSport?.name}</strong>
            </p>
            {isTeamSport && (
              <p>
                <span className="text-muted-foreground">Équipe :</span>{" "}
                <strong>
                  {createTeamMode
                    ? newTeamName
                    : sportTeams?.find((t) => t.id === selectedTeamId)?.name ??
                      "—"}
                </strong>
              </p>
            )}
            <p className="text-amber-700 text-xs mt-3">
              ⚠️ Le participant sera retiré de son sport actuel et inscrit dans
              le nouveau sport.
            </p>
          </div>
        )}

        <DialogFooter className="gap-2">
          {step !== "select-sport" && (
            <Button
              variant="outline"
              onClick={() =>
                setStep(
                  step === "confirm" && isTeamSport
                    ? "select-team"
                    : "select-sport",
                )
              }
              disabled={isLoading}
            >
              Retour
            </Button>
          )}
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Annuler
          </Button>
          {step === "select-sport" && (
            <Button onClick={handleNextFromSport} disabled={!selectedSportId}>
              Suivant
            </Button>
          )}
          {step === "select-team" && (
            <Button
              onClick={() => setStep("confirm")}
              disabled={
                !createTeamMode && !selectedTeamId
                  ? true
                  : createTeamMode && !newTeamName.trim()
              }
            >
              Suivant
            </Button>
          )}
          {step === "confirm" && (
            <LoadingButton onClick={handleConfirm} isLoading={isLoading}>
              Confirmer
            </LoadingButton>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
