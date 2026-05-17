"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/common/LoadingButton";
import { useToast } from "@/components/ui/use-toast";
import { useInviteToken } from "@/hooks/raid/useInviteToken";
import { Check, Copy } from "lucide-react";
import { useLocale } from "next-intl";
import { useState } from "react";

interface InviteLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: string;
}

export const InviteLinkDialog = ({
  open,
  onOpenChange,
  teamId,
}: InviteLinkDialogProps) => {
  const { createInviteToken, isCreationLoading } = useInviteToken();
  const { toast } = useToast();
  const locale = useLocale();
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const buildLink = (token: string) => {
    if (typeof window === "undefined") return `?invite=${token}`;
    const { protocol, host } = window.location;
    const baseHost = host.replace(/^[^.]+\./, "");
    return `${protocol}//raid-registering.${baseHost}/${locale}/team/invite/${token}`;
  };

  const handleGenerate = () => {
    createInviteToken(teamId, async (token) => {
      const url = buildLink(token.token);
      setLink(url);
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast({
          title: "Lien d'invitation copié",
          description: "Partagez-le avec votre coéquipier.",
        });
      } catch {
        toast({
          title: "Lien généré",
          description: "Copiez le lien manuellement.",
        });
      }
    });
  };

  const handleCopy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast({ title: "Lien copié" });
    } catch {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de copier le lien.",
      });
    }
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      setLink(null);
      setCopied(false);
    }
    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Inviter un coéquipier</DialogTitle>
          <DialogDescription>
            Générez un lien d&apos;invitation personnel et partagez-le avec
            votre coéquipier. Il pourra rejoindre votre équipe en un clic.
          </DialogDescription>
        </DialogHeader>
        {link ? (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input readOnly value={link} className="font-mono text-xs" />
              <Button
                size="icon"
                variant="outline"
                onClick={handleCopy}
                aria-label="Copier"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Ce lien est unique et ne peut être utilisé qu&apos;une seule fois.
            </p>
          </div>
        ) : (
          <LoadingButton
            isLoading={isCreationLoading}
            onClick={handleGenerate}
            className="w-full"
          >
            Générer un lien d&apos;invitation
          </LoadingButton>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
