"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  UserMinus,
  ArrowLeft,
  Edit,
  Trash2,
  User,
  Mail,
  IdCard,
  School,
  Shield,
  Settings,
  Users,
} from "lucide-react";
import {
  UserGroupMembership,
  UserGroupMembershipComplete,
} from "@/src/api/hyperionSchemas";
import { AVAILABLE_GROUPS } from "@/src/infra/groups";
import { formatSchoolName } from "@/src/utils/schoolFormatting";

interface UserDetailProps {
  user: UserGroupMembershipComplete;
  onEdit?: () => void;
  onRemoveFromGroup: () => void;
}

const UserDetail = ({ user, onEdit, onRemoveFromGroup }: UserDetailProps) => {
  const groupName =
    AVAILABLE_GROUPS.find((g) => g.id === user.group)?.name || user.group;

  const getGroupColor = (group: string) => {
    switch (group) {
      case "schools_bds":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "sport_manager":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getGroupIcon = (group: string) => {
    switch (group) {
      case "schools_bds":
        return <Users className="h-5 w-5" />;
      case "sport_manager":
        return <Settings className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  const userName =
    user.user.firstname || user.user.name
      ? `${user.user.firstname || ""} ${user.user.name || ""}`.trim()
      : "Utilisateur";

  return (
    <div className="flex w-full flex-col space-y-6">
      {/* Header with breadcrumb-style navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            {userName}
          </h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge
              variant="outline"
              className={`gap-1 ${getGroupColor(user.group)}`}
            >
              {getGroupIcon(user.group)}
              {groupName}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          {onEdit && (
            <Button variant="outline" onClick={onEdit} className="gap-2">
              <Edit className="h-4 w-4" />
              Modifier
            </Button>
          )}
          <Button
            variant="destructive"
            onClick={onRemoveFromGroup}
            className="gap-2 hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-4 w-4" />
            Retirer du groupe
          </Button>
        </div>
      </div>

      {/* User Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Nom complet
                </p>
                <p className="text-2xl font-bold text-blue-600">{userName}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {user.user.email && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Email
                  </p>
                  <p className="text-lg font-bold text-green-600 truncate">
                    {user.user.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <School className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  École
                </p>
                <p className="text-lg font-bold text-purple-600 font-mono">
                  {formatSchoolName(user.user.school?.name)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informations détaillées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Informations personnelles</h3>
              <div className="space-y-3">
                {user.user.firstname && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Prénom
                    </p>
                    <p className="text-sm">{user.user.firstname}</p>
                  </div>
                )}
                {user.user.name && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Nom
                    </p>
                    <p className="text-sm">{user.user.name}</p>
                  </div>
                )}
                {user.user.email && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Email
                    </p>
                    <p className="text-sm">{user.user.email}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Informations du groupe</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Groupe
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {getGroupIcon(user.group)}
                    <span className="text-sm">{groupName}</span>
                  </div>
                </div>
                {user.user.school && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      École
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <School className="h-4 w-4" />
                      <span className="text-sm">
                        {formatSchoolName(user.user.school.name)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetail;
