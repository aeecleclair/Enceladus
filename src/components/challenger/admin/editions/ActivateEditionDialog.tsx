"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { LoadingButton } from "@/src/components/custom/LoadingButton";
import { PlayCircle, StopCircle, AlertTriangle } from "lucide-react";
import type * as Schemas from "@/src/api/hyperionSchemas";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useEditions } from "@/src/hooks/useEditions";

interface ActivateEditionDialogProps {
  open: boolean;
  edition: Schemas.CompetitionEdition;
  activeEdition: Schemas.CompetitionEdition | null;
  onClose: () => void;
}

export const ActivateEditionDialog = ({
  open,
  edition,
  activeEdition,
  onClose,
}: ActivateEditionDialogProps) => {
  const { activateEdition, isActivateLoading } = useEditions();

  const handleActivate = () => {
    activateEdition(edition.id, onClose);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PPP", { locale: fr });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-green-600" />
            Activer l&apos;édition
          </DialogTitle>
          <DialogDescription>
            Confirmez l&apos;activation de cette édition.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {activeEdition && (
            <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <span className="font-medium text-orange-800">Attention</span>
              </div>
              <p className="text-sm text-orange-700">
                L&apos;édition <strong>{activeEdition.name}</strong> est
                actuellement active. L&apos;activation de cette nouvelle édition
                la désactivera automatiquement.
              </p>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <h4 className="font-medium mb-2">Édition à activer :</h4>
              <div className="p-3 border rounded-lg bg-green-50 border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-green-800">
                    {edition.name}
                  </span>
                  <Badge
                    variant="outline"
                    className="border-green-600 text-green-700"
                  >
                    Année {edition.year}
                  </Badge>
                </div>
                <p className="text-sm text-green-600">
                  Du {formatDate(edition.start_date)} au{" "}
                  {formatDate(edition.end_date)}
                </p>
              </div>
            </div>

            {activeEdition && (
              <div>
                <h4 className="font-medium mb-2">
                  Édition actuellement active :
                </h4>
                <div className="p-3 border rounded-lg bg-gray-50 border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800">
                      {activeEdition.name}
                    </span>
                    <Badge variant="default">
                      <StopCircle className="w-3 h-3 mr-1" />
                      Sera désactivée
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Du {formatDate(activeEdition.start_date)} au{" "}
                    {formatDate(activeEdition.end_date)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isActivateLoading}
          >
            Annuler
          </Button>
          <LoadingButton
            onClick={handleActivate}
            isLoading={isActivateLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            Activer l&apos;édition
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
