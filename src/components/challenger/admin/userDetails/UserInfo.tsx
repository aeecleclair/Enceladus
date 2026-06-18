"use client";

import { CompetitionUser } from "@/api";
import { useSportSchools } from "@/hooks/challenger/useSportSchools";
import { formatSchoolName } from "@/lib/challenger/schoolFormatting";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { IdCard, Mail, Phone, School, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type InfoItemProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

const InfoItem = ({ icon: Icon, label, value }: InfoItemProps) => (
  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
    <Icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-semibold wrap-break-word">{value}</p>
    </div>
  </div>
);

export const UserInfo = ({ user }: { user: CompetitionUser }) => {
  const { sportSchools } = useSportSchools();

  const userSchool = sportSchools
    ? sportSchools.find((ss) => ss.school_id === user.user.school_id)
    : undefined;

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
