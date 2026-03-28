"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Switch } from "../../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { LoadingButton } from "../../custom/LoadingButton";
import { Pencil } from "lucide-react";
import {
  CompetitionUser,
  CompetitionUserEdit,
  SportCategory,
} from "@/src/api/hyperionSchemas";

interface EditCompetitionUserDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (body: CompetitionUserEdit) => void;
  isLoading: boolean;
  user: CompetitionUser;
}

export const EditCompetitionUserDialog = ({
  open,
  onClose,
  onConfirm,
  isLoading,
  user,
}: EditCompetitionUserDialogProps) => {
  const [sportCategory, setSportCategory] = useState<SportCategory>(
    user.sport_category,
  );
  const [isAthlete, setIsAthlete] = useState(user.is_athlete ?? false);
  const [isPompom, setIsPompom] = useState(user.is_pompom ?? false);
  const [isFanfare, setIsFanfare] = useState(user.is_fanfare ?? false);
  const [isCameraman, setIsCameraman] = useState(user.is_cameraman ?? false);
  const [isVolunteer, setIsVolunteer] = useState(user.is_volunteer ?? false);
  const [allowPictures, setAllowPictures] = useState(
    user.allow_pictures ?? true,
  );

  useEffect(() => {
    if (open) {
      setSportCategory(user.sport_category);
      setIsAthlete(user.is_athlete ?? false);
      setIsPompom(user.is_pompom ?? false);
      setIsFanfare(user.is_fanfare ?? false);
      setIsCameraman(user.is_cameraman ?? false);
      setIsVolunteer(user.is_volunteer ?? false);
      setAllowPictures(user.allow_pictures ?? true);
    }
  }, [open, user]);

  const handleSubmit = () => {
    const body: CompetitionUserEdit = {};

    if (sportCategory !== user.sport_category)
      body.sport_category = sportCategory;
    if (isAthlete !== (user.is_athlete ?? false)) body.is_athlete = isAthlete;
    if (isPompom !== (user.is_pompom ?? false)) body.is_pompom = isPompom;
    if (isFanfare !== (user.is_fanfare ?? false)) body.is_fanfare = isFanfare;
    if (isCameraman !== (user.is_cameraman ?? false))
      body.is_cameraman = isCameraman;
    if (isVolunteer !== (user.is_volunteer ?? false))
      body.is_volunteer = isVolunteer;
    if (allowPictures !== (user.allow_pictures ?? true))
      body.allow_pictures = allowPictures;

    onConfirm(body);
  };

  const isCancelled = user.cancelled ?? false;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5" />
            Modifier le participant
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Catégorie sportive</Label>
            <Select
              value={sportCategory}
              onValueChange={(v) => setSportCategory(v as SportCategory)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="masculine">Masculine</SelectItem>
                <SelectItem value="feminine">Féminine</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Rôles</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="is_athlete" className="font-normal">
                  Athlète
                </Label>
                <Switch
                  id="is_athlete"
                  checked={isAthlete}
                  onCheckedChange={setIsAthlete}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_pompom" className="font-normal">
                  Pompom
                </Label>
                <Switch
                  id="is_pompom"
                  checked={isPompom}
                  onCheckedChange={setIsPompom}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_fanfare" className="font-normal">
                  Fanfare
                </Label>
                <Switch
                  id="is_fanfare"
                  checked={isFanfare}
                  onCheckedChange={setIsFanfare}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_cameraman" className="font-normal">
                  Cameraman
                </Label>
                <Switch
                  id="is_cameraman"
                  checked={isCameraman}
                  onCheckedChange={setIsCameraman}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_volunteer" className="font-normal">
                  Bénévole
                </Label>
                <Switch
                  id="is_volunteer"
                  checked={isVolunteer}
                  onCheckedChange={setIsVolunteer}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="allow_pictures" className="font-normal">
              Autorisation photos
            </Label>
            <Switch
              id="allow_pictures"
              checked={allowPictures}
              onCheckedChange={setAllowPictures}
            />
          </div>

          {isCancelled && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
              <p>
                Ce participant est actuellement <strong>désinscrit</strong>.
                Enregistrer les modifications réactivera son inscription.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <LoadingButton onClick={handleSubmit} isLoading={isLoading}>
            {isCancelled ? "Enregistrer et réinscrire" : "Enregistrer"}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
