"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Trophy, CheckCircle2 } from "lucide-react";

interface EndMatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team1Name: string;
  team2Name: string;
  team1Id: string;
  team2Id: string;
  scoreTeam1?: number | null;
  scoreTeam2?: number | null;
  onConfirm: (winnerId: string | null) => void;
}

export function EndMatchDialog({
  open,
  onOpenChange,
  team1Name,
  team2Name,
  team1Id,
  team2Id,
  scoreTeam1,
  scoreTeam2,
  onConfirm,
}: EndMatchDialogProps) {
  const defaultWinner = (() => {
    if (
      scoreTeam1 != null &&
      scoreTeam2 != null &&
      scoreTeam1 !== scoreTeam2
    ) {
      return scoreTeam1 > scoreTeam2 ? team1Id : team2Id;
    }
    if (scoreTeam1 != null && scoreTeam2 != null && scoreTeam1 === scoreTeam2) {
      return null; // draw
    }
    return undefined; // no default
  })();

  const [selected, setSelected] = useState<string | null | undefined>(
    defaultWinner,
  );

  // Reset selection when dialog opens
  useEffect(() => {
    if (open) {
      setSelected(defaultWinner);
    }
  }, [open, defaultWinner]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Terminer le match</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Sélectionnez le vainqueur de ce match.
        </p>
        <div className="space-y-2 py-2">
          <Button
            type="button"
            variant={selected === team1Id ? "default" : "outline"}
            className="w-full justify-start gap-2"
            onClick={() => setSelected(team1Id)}
          >
            <Trophy className="h-4 w-4" />
            {team1Name}
            {scoreTeam1 != null && (
              <span className="ml-auto text-sm opacity-70">
                {scoreTeam1} pts
              </span>
            )}
          </Button>
          <Button
            type="button"
            variant={selected === team2Id ? "default" : "outline"}
            className="w-full justify-start gap-2"
            onClick={() => setSelected(team2Id)}
          >
            <Trophy className="h-4 w-4" />
            {team2Name}
            {scoreTeam2 != null && (
              <span className="ml-auto text-sm opacity-70">
                {scoreTeam2} pts
              </span>
            )}
          </Button>
          <Button
            type="button"
            variant={selected === null ? "default" : "outline"}
            className="w-full justify-start gap-2"
            onClick={() => setSelected(null)}
          >
            Match nul
          </Button>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          <Button
            type="button"
            disabled={selected === undefined}
            onClick={() => {
              onConfirm(selected ?? null);
              onOpenChange(false);
            }}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Confirmer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
