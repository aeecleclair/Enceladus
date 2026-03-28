"use client";

import {
  CompetitionUser,
  ParticipantComplete,
} from "@/src/api/hyperionSchemas";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Trophy, Users2, Shield, Camera, Music, Heart } from "lucide-react";
import { Badge } from "../../ui/badge";
import { useSports } from "@/src/hooks/useSports";
import { Separator } from "../../ui/separator";

export const UserCompetition = ({
  user,
  userParticipant,
}: {
  user: CompetitionUser;
  userParticipant: ParticipantComplete | undefined;
}) => {
  const { sports } = useSports();

  const getParticipantType = (user: CompetitionUser) => {
    const types = [];
    if (user.is_athlete) types.push("Athlète");
    if (user.is_pompom) types.push("Pompom");
    if (user.is_fanfare) types.push("Fanfare");
    if (user.is_cameraman) types.push("Cameraman");
    if (
      !user.is_athlete &&
      !user.is_pompom &&
      !user.is_fanfare &&
      !user.is_cameraman
    ) {
      types.push("Bénévole");
    }
    return types;
  };

  const getParticipantTypeIcon = (type: string) => {
    switch (type) {
      case "Athlète":
        return Trophy;
      case "Pompom":
        return Users2;
      case "Fanfare":
        return Music;
      case "Cameraman":
        return Camera;
      case "Bénévole":
        return Heart;
      default:
        return Shield;
    }
  };

  const getParticipantTypeColor = (type: string) => {
    switch (type) {
      case "Athlète":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300";
      case "Pompom":
        return "bg-pink-100 text-pink-800 hover:bg-pink-200 border-pink-300";
      case "Fanfare":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300";
      case "Cameraman":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-300";
      case "Bénévole":
        return "bg-green-100 text-green-800 hover:bg-green-200 border-green-300";
      default:
        return "";
    }
  };

  const participantTypes = getParticipantType(user);
  const userSport =
    sports && userParticipant
      ? sports.find((s) => s.id === userParticipant.sport_id)
      : null;

  const InfoSection = ({
    title,
    items,
  }: {
    title: string;
    items: { label: string; value: React.ReactNode }[];
  }) => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">{title}</h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex flex-col gap-1">
            <p className="text-sm font-medium text-muted-foreground">
              {item.label}
            </p>
            <div className="text-sm">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const StatusBadge = ({
    isValid,
    trueLabel = "Oui",
    falseLabel = "Non",
  }: {
    isValid: boolean;
    trueLabel?: string;
    falseLabel?: string;
  }) => (
    <Badge
      variant="secondary"
      className={
        isValid
          ? "bg-green-100 text-green-800 hover:bg-green-200 border-green-300"
          : "bg-red-100 text-red-800 hover:bg-red-200 border-red-300"
      }
    >
      {isValid ? trueLabel : falseLabel}
    </Badge>
  );

  const competitionInfo = [
    {
      label: "Type de participant",
      value: (
        <div className="flex flex-wrap gap-2">
          {participantTypes.map((type, index) => {
            const Icon = getParticipantTypeIcon(type);
            return (
              <Badge
                key={index}
                variant="secondary"
                className={`${getParticipantTypeColor(type)} flex items-center gap-1.5 border`}
              >
                <Icon className="h-3.5 w-3.5" />
                {type}
              </Badge>
            );
          })}
        </div>
      ),
    },
    ...(user.sport_category
      ? [
          {
            label: "Catégorie sportive",
            value: (
              <Badge variant="outline" className="font-normal">
                {user.sport_category}
              </Badge>
            ),
          },
        ]
      : []),
    {
      label: "Autorisation de diffusion de photos",
      value: <StatusBadge isValid={user.allow_pictures || false} />,
    },
    {
      label: "Validation de l'école",
      value: (
        <StatusBadge
          isValid={user.validated || false}
          trueLabel="Validé"
          falseLabel="Non validé"
        />
      ),
    },
  ];

  const athleteInfo = userParticipant
    ? [
        ...(userSport
          ? [
              {
                label: "Sport",
                value: (
                  <Badge variant="outline" className="font-semibold">
                    {userSport.name}
                  </Badge>
                ),
              },
            ]
          : []),
        {
          label: "Équipe",
          value: (
            <div className="flex items-center gap-2">
              <span className="font-medium">{userParticipant.team.name}</span>
              {userParticipant.substitute && (
                <Badge variant="secondary" className="text-xs">
                  Remplaçant
                </Badge>
              )}
              {userParticipant.team.captain_id === user.user_id && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-amber-100 text-amber-800 hover:bg-amber-200"
                >
                  Capitaine
                </Badge>
              )}
            </div>
          ),
        },
        {
          label: "Licence",
          value: (
            <StatusBadge
              isValid={userParticipant.is_license_valid}
              trueLabel="Validée"
              falseLabel="Non validée"
            />
          ),
        },
      ]
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Compétition et participant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InfoSection
            title="Informations de compétition"
            items={competitionInfo}
          />
          {athleteInfo && (
            <>
              <Separator className="lg:hidden" />
              <InfoSection
                title="Informations de sportif"
                items={athleteInfo}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
