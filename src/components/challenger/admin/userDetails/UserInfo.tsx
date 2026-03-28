"use client";

import { CompetitionUser } from "@/src/api/hyperionSchemas";
import { Mail, Phone, School, User, IdCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { formatSchoolName } from "@/src/utils/schoolFormatting";
import { useSportSchools } from "@/src/hooks/useSportSchools";

export const UserInfo = ({ user }: { user: CompetitionUser }) => {
  const { sportSchools } = useSportSchools();

  const userSchool = sportSchools
    ? sportSchools.find((ss) => ss.school_id === user.user.school_id)
    : undefined;

  const InfoItem = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: string;
  }) => (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
      <Icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-muted-foreground mb-1">
          {label}
        </p>
        <p className="text-sm font-semibold break-words">{value}</p>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Informations personnelles
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.user.name && (
            <InfoItem icon={IdCard} label="Nom" value={user.user.name} />
          )}
          {user.user.firstname && (
            <InfoItem
              icon={IdCard}
              label="Prénom"
              value={user.user.firstname}
            />
          )}
          {user.user.email && (
            <InfoItem icon={Mail} label="Email" value={user.user.email} />
          )}
          {user.user.phone && (
            <InfoItem icon={Phone} label="Téléphone" value={user.user.phone} />
          )}
          {userSchool && (
            <InfoItem
              icon={School}
              label="École"
              value={formatSchoolName(userSchool.school.name) || ""}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
