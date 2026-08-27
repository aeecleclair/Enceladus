"use client";
import { CustomDialog } from "@/components/common/CustomDialog";
import { TeamsForm } from "@/components/my-documents/TeamForm";
import { TemplateCard } from "@/components/my-documents/TemplateCard";
import { teamFormSchema } from "@/forms/myDocuments/team";
import { useMyTeams } from "@/hooks/my-documents/useMyTeams";
import { useMeUser } from "@/hooks/useMeUser";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PencilIcon, PlusIcon } from "lucide-react";

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
  const {
    teams,
    createTeam,
    updateTeam,
    isTeamLoading,
    isCreateTeamLoading,
    isUpdateLoading,
  } = useMyTeams();
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(
    teams[0]?.id ?? null,
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  useEffect(() => {
    if (teams.length > 0 && selectedTeamId === null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedTeamId(teams[0].id);
    }
  }, [teams, selectedTeamId]);

  if (isTeamLoading) {
    return (
      <div className="p-6 gap-4 flex flex-col">
        <h1 className="text-2xl font-bold">{t("admin.loading")}</h1>
      </div>
    );
  }

  if (selectedTeamId === null) {
    return (
      <div className="p-6 gap-4 flex flex-col">
        <h1 className="text-2xl font-bold">{t("admin.noTeam")}</h1>
        {user?.groups && user.groups.length > 0 ? (
          <div className="flex flex-col gap-4">
            <p>{t("admin.noTeamDescription")}</p>
            <Card>
              <CardContent>
                <TeamsForm
                  form={form}
                  groups={user.groups}
                  onSubmit={(values) => createTeam(values)}
                  isLoading={isCreateTeamLoading}
                  submitLabel={t("team.createSubmit")}
                />
              </CardContent>
            </Card>
          </div>
        ) : (
          <p>{t("admin.noGroup")}</p>
        )}
      </div>
    );
  }

  const team = teams.find((team) => team.id === selectedTeamId);
  return (
    <div className="p-6">
      <div className="flex flex-row justify-between items-center mb-6 w-full">
        <div className="flex flex-row gap-2 items-center">
          <h1 className="text-2xl font-bold">{t("admin.templates")}</h1>
          <Select
            onValueChange={setSelectedTeamId}
            defaultValue={selectedTeamId}
          >
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
          {user?.groups && team && (
            <CustomDialog
              isOpened={isUpdateModalOpen}
              setIsOpened={setIsUpdateModalOpen}
              title={t("team.update")}
              description={
                <TeamsForm
                  form={form}
                  groups={user.groups}
                  onSubmit={(values) => updateTeam(team.id, values)}
                  isLoading={isUpdateLoading}
                  submitLabel={t("team.update")}
                />
              }
            >
              <Button
                variant="secondary"
                onClick={() => {
                  form.setValue("name", team.name);
                  form.setValue("group_id", team.group_id);
                  form.setValue("api_key", team.api_key);
                  setIsUpdateModalOpen(true);
                }}
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
            </CustomDialog>
          )}
        </div>
        {user?.groups && (
          <CustomDialog
            isOpened={isCreateModalOpen}
            setIsOpened={setIsCreateModalOpen}
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
            <Button
              variant="secondary"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <PlusIcon className="h-4 w-4" />
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
