import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { DocumentView } from "../../custom/DocumentView";
import { Button } from "../../ui/button";
import { Eye } from "lucide-react";
import { useState } from "react";

export interface ParticipantData {
  userId: string;
  sportId: string;
  sportName: string;
  fullName: string;
  email: string;
  license?: string;
  certificateFileId?: string;
  isValidated: boolean;
}

interface CertificateLicenseProps {
  participant: ParticipantData;
}

export const CertificateLicense = ({
  participant,
}: CertificateLicenseProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex justify-center">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Eye className="h-4 w-4" />
            Voir le document
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              Certificat médical - {participant.fullName}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <DocumentView
              documentKey="certificate"
              userId={participant.userId}
              username={participant.fullName}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
