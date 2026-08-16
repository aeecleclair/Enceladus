"use client";
import { CustomDialog } from "@/components/common/CustomDialog";
import { TeamsForm } from "@/components/my-documents/TeamForm";
import { TemplateCard } from "@/components/my-documents/TemplateCard";
import { teamFormSchema } from "@/forms/myDocuments/team";
import { useMyTeams } from "@/hooks/my-documents/useMyTeams";
import { useMeUser } from "@/hooks/useMeUser";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Admin() {
  const t = useTranslations("myDocuments");
  const { user } = useMeUser();
  const form = useForm({
    defaultValues: {
      name: "",
      group_id: "",
      api_key: "",
    },
    resolver: zodResolver(teamFormSchema),
    mode: "onChange",
  });
  const { teams, createTeam, isCreateTeamLoading } = useMyTeams();
  const [selectedTeamId, setSelectedTeamId] = useState<string>(teams[0].id);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        {user?.groups && (
          <CustomDialog
            isOpened={isModalOpen}
            setIsOpened={setIsModalOpen}
            title={t("team.creation")}
            description={
              <TeamsForm
                form={form}
                groups={user.groups}
                onSubmit={(values) => createTeam(values)}
                isLoading={isCreateTeamLoading}
                submitLabel={t("team.createSubmit")}
              />
            }
          >
            <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
              {t("team.create")}
            </Button>
          </CustomDialog>
        )}
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
