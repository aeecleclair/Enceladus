"use client";

import { CompetitionUser } from "@/src/api/hyperionSchemas";
import { formatSchoolName } from "@/src/utils/schoolFormatting";
import { Phone, Copy, UsersIcon, CheckIcon } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useState } from "react";

interface TeamScoreDisplayProps {
  teamName: string;
  schoolName?: string;
  score: number | null | undefined;
  placeholder?: string;
  captain?: CompetitionUser;
  isWinner?: boolean;
}

export const TeamScoreDisplay = ({
  teamName,
  schoolName,
  score,
  placeholder = "-",
  captain,
  isWinner,
}: TeamScoreDisplayProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyPhone = async (phone: string) => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy phone number:", err);
    }
  };

  return (
    <div className="col-span-1 flex flex-col items-center justify-center min-w-0 overflow-hidden">
      <div className="text-sm font-medium text-center mb-0.5 truncate w-full">{teamName}</div>
      {schoolName && (
        <div className="text-xs text-muted-foreground text-center mb-0.5">
          {formatSchoolName(schoolName)}
        </div>
      )}
      {captain && (
        <div className="text-xs text-muted-foreground text-center mb-1">
          <div className="font-medium">
            <UsersIcon className="inline-block h-3 w-3 mr-1" />
            {captain.user.firstname} {captain.user.name}
          </div>
          {captain.user.phone && (
            <div className="flex items-center justify-center gap-1 mt-1">
              <a
                href={`tel:${captain.user.phone}`}
                className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-800 transition-colors"
                title="Appeler"
              >
                <Phone className="h-3 w-3" />
                <span className="font-mono text-[10px]">{captain.user.phone}</span>
              </a>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0.5 hover:bg-gray-100"
                onClick={() => handleCopyPhone(captain.user.phone!)}
                title={copied ? "Copié !" : "Copier le numéro"}
              >
                {copied ? (
                  <CheckIcon className="text-green-500 text-xs" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          )}
        </div>
      )}
      {score !== null && score !== undefined ? (
        <div
          className={`text-2xl font-bold ${isWinner ? "text-green-600" : ""}`}
        >
          {score}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">{placeholder}</div>
      )}
    </div>
  );
};
