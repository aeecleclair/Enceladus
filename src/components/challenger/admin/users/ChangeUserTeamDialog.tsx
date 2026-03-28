import { useState } from "react";
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
import { useSportTeams } from "@/src/hooks/useSportTeams";
import { useChangeParticipantSport } from "@/src/hooks/useChangeParticipantSport";
import { useCreateTeam } from "@/src/hooks/useCreateTeam";

interface ChangeUserTeamDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
  sportId: string;
  schoolId: string;
}

export const ChangeUserTeamDialog = ({
  open,
  onClose,
  onSuccess,
  userId,
  sportId,
  schoolId,
}: ChangeUserTeamDialogProps) => {
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [createTeamMode, setCreateTeamMode] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");

  const { sportTeams, refetchTeams } = useSportTeams({ sportId });

  const { changeParticipantTeam, isChangeLoading } =
    useChangeParticipantSport();
  const { createTeam, isCreateTeamLoading } = useCreateTeam();

  const doChange = (teamId: string) => {
    changeParticipantTeam(sportId, userId, teamId, () => {
      handleClose();
      onSuccess();
    });
  };

  const handleConfirm = () => {
    if (createTeamMode && newTeamName.trim()) {
      createTeam(
        {
          name: newTeamName.trim(),
          sport_id: sportId,
          school_id: schoolId,
          captain_id: userId,
        },
        (teamId) => {
          refetchTeams();
          doChange(teamId);
        },
      );
    } else if (selectedTeamId) {
      doChange(selectedTeamId);
    }
  };

  const handleClose = () => {
    setSelectedTeamId("");
    setCreateTeamMode(false);
    setNewTeamName("");
    onClose();
  };

  const isLoading = isChangeLoading || isCreateTeamLoading;
  const canConfirm = createTeamMode ? !!newTeamName.trim() : !!selectedTeamId;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Changer d&apos;équipe</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!createTeamMode ? (
            <div>
              <Label>Nouvelle équipe</Label>
              <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
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

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Annuler
          </Button>
          <LoadingButton
            onClick={handleConfirm}
            isLoading={isLoading}
            disabled={!canConfirm}
          >
            Confirmer
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
