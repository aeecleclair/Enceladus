"use client";
import { TemplateCard } from "@/components/my-documents/TemplateCard";
import { useMyTeams } from "@/hooks/my-documents/useMyTeams";

import { useTranslations } from "next-intl";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Admin() {
  const t = useTranslations("myDocuments");
  const { teams } = useMyTeams();
  const [selectedTeamId, setSelectedTeamId] = useState<string>(teams[0].id);

  const team = teams.find((team) => team.id === selectedTeamId);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold pb-8">{t("admin.templates")}</h1>
      <div className="flex flex-row gap-4 pb-8 items-center">
        {t("admin.selectTeam")}
        <Select onValueChange={setSelectedTeamId} defaultValue={selectedTeamId}>
          <SelectTrigger className="w-45 border border-black">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {teams.map((team) => (
              <SelectItem key={team.id} value={team.id}>
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {team && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}
    </div>
  );
}
