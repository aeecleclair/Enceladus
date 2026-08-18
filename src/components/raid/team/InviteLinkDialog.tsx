"use client";

import { LoadingButton } from "@/components/common/LoadingButton";
import { useInviteToken } from "@/hooks/raid/useInviteToken";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

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
import { useToast } from "@/components/ui/use-toast";

import { Check, Copy } from "lucide-react";

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
  const t = useTranslations("raid.team.inviteDialog");
  const { createInviteToken, isCreationLoading } = useInviteToken();
  const { toast } = useToast();
  const locale = useLocale();
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const buildLink = (token: string) => {
    if (typeof window === "undefined") return `?invite=${token}`;
    const { protocol, host } = window.location;
    const baseHost = host.replace(/^[^.]+\./, "");
    return `${protocol}//inscription-raid.${baseHost}/${locale}/team/invite/${token}`;
  };

  const handleGenerate = () => {
    createInviteToken(teamId, async (token) => {
      const url = buildLink(token.token);
      setLink(url);
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast({
          title: t("linkCopiedTitle"),
          description: t("linkCopiedDescription"),
        });
      } catch {
        toast({
          title: t("linkGeneratedTitle"),
          description: t("linkGeneratedDescription"),
        });
      }
    });
  };

  const handleCopy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast({ title: t("copiedTitle") });
    } catch {
      toast({
        variant: "destructive",
        title: t("copyErrorTitle"),
        description: t("copyErrorDescription"),
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
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        {link ? (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input readOnly value={link} className="font-mono text-xs" />
              <Button
                size="icon"
                variant="outline"
                onClick={handleCopy}
                aria-label={t("copy")}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{t("linkOnce")}</p>
          </div>
        ) : (
          <LoadingButton
            isLoading={isCreationLoading}
            onClick={handleGenerate}
            className="w-full"
          >
            {t("generate")}
          </LoadingButton>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            {t("close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
