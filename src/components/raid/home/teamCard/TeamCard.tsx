"use client";

import { TeamEdit } from "./TeamEdit";
import { TeamInfoCard } from "./TeamInfoCard";

import { RaidTeam } from "@/api";
import { useInformation } from "@/hooks/raid/useInformation";
import { formatDateRange, getDaysLeft } from "@/lib/dateFormat";
import {
  difficulties,
  difficultyDescriptions,
  getLabelFromValue,
  meetingPlaces,
} from "@/lib/raid/comboboxValues";

import { useState } from "react";
import {
  HiOutlineCalendar,
  HiOutlineLocationMarker,
  HiPencil,
  HiX,
} from "react-icons/hi";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface TeamCardProps {
  team?: RaidTeam;
}

export const TeamCard = ({ team }: TeamCardProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const { information } = useInformation();

  const isRegisteringOpen = information?.raid_registering_end_date
    ? getDaysLeft(information?.raid_registering_end_date) >= 0
    : false;

  function toggleEdit() {
    setIsEdit(!isEdit);
  }

  const informationCard = [
    {
      title: "Lieu de rendez-vous",
      value: getLabelFromValue(meetingPlaces, team?.meeting_place ?? undefined),
      description: "lieu de départ et d'arrivée",
      unit: <HiOutlineLocationMarker className="h-4 w-4" />,
    },
    {
      title: "Dates",
      value:
        information?.raid_start_date && information?.raid_end_date
          ? formatDateRange(
              information.raid_start_date,
              information.raid_end_date,
            )
          : "Dates non renseignées",
      description: "week-end complet",
      unit: <HiOutlineCalendar className="h-4 w-4" />,
    },
    {
      title: "Inscription",
      value: `${team?.validation_progress.toFixed(0)}%`,
      description: information?.raid_registering_end_date
        ? isRegisteringOpen
          ? `${getDaysLeft(
              information?.raid_registering_end_date,
            )} jours restants`
          : "Inscriptions fermées"
        : "Date de fin non renseignée",
      unit: <span>%</span>,
    },
    {
      title: "Parcours",
      value: getLabelFromValue(difficulties, team?.difficulty ?? undefined),
      description: getLabelFromValue(
        difficultyDescriptions,
        team?.difficulty ?? undefined,
      ),
      unit: undefined,
    },
  ];

  return (
    <Card className="w-full mt-5">
      <div className="flex flex-col">
        <CardHeader>
          <div className="flex flex-row justify-between">
            <CardTitle>
              {isEdit ? (
                <div>{"Éditer l'équipe"}</div>
              ) : (
                <>
                  {team?.name ? (
                    <div>{team?.name}</div>
                  ) : (
                    <Skeleton className="w-24 h-8" />
                  )}
                </>
              )}
            </CardTitle>
            {isEdit && team ? (
              <Button
                variant="destructive"
                onClick={toggleEdit}
                className="w-27.5"
              >
                <HiX className="mr-2 h-4 w-4" />
                Annuler
              </Button>
            ) : (
              <Button variant="outline" onClick={toggleEdit} className="w-27.5">
                <HiPencil className="mr-2 h-4 w-4" />
                Éditer
              </Button>
            )}
          </div>
          <div className="h-4"></div>
          {isEdit && team ? (
            <TeamEdit team={team!} setIsEdit={setIsEdit} />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
              {informationCard.map((info) => (
                <TeamInfoCard
                  info={info}
                  key={info.title}
                  isLoaded={team !== undefined}
                />
              ))}
            </div>
          )}
        </CardHeader>
      </div>
    </Card>
  );
};
