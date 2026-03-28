"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Mail, School, Eye, Trash2 } from "lucide-react";
import {
  UserGroupMembership,
  UserGroupMembershipComplete,
} from "@/src/api/hyperionSchemas";
import Link from "next/link";
import { formatSchoolName } from "@/src/utils/schoolFormatting";

interface GroupCardProps {
  user: UserGroupMembershipComplete;
  onClick: () => void;
  onRemove?: () => void;
}

const GroupCard = ({ user, onClick, onRemove }: GroupCardProps) => {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group h-full"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2 flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-sm">
                {user.user.firstname?.[0] || user.user_id?.[0] || "U"}
                {user.user.name?.[0] || ""}
              </AvatarFallback>
            </Avatar>
            {user.user.firstname || user.user.name
              ? `${user.user.firstname || ""} ${user.user.name || ""}`.trim()
              : `Utilisateur ${user.user_id.slice(0, 8)}`}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="py-3">
        <div className="space-y-2 text-sm text-muted-foreground">
          {user.user.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span className="truncate">{user.user.email}</span>
            </div>
          )}
          {user.user.school && (
            <div className="flex items-center gap-2">
              <School className="h-4 w-4" />
              <span className="truncate">
                {formatSchoolName(user.user.school.name)}
              </span>
            </div>
          )}
        </div>
        <Link
          href={`/admin/groups?user_id=${user.user_id}&group_id=${user.group}`}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary/80 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Eye className="h-4 w-4" />
          Voir les détails
        </Link>
      </CardContent>

      <CardFooter className="pt-3">
        {onRemove && (
          <Button
            variant="destructive"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="w-full gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Retirer
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default GroupCard;
