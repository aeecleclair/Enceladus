"use client";

import { SchoolExtension } from "@/src/api/hyperionSchemas";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { formatSchoolName } from "@/src/utils/schoolFormatting";
import { getSchoolType } from "@/src/utils/schools";
import {
  Eye,
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
} from "lucide-react";
import Link from "next/link";

interface SchoolCardProps {
  school: SchoolExtension;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const SchoolCard = ({
  school,
  onClick,
  onEdit,
  onDelete,
}: SchoolCardProps) => {
  const formattedName = formatSchoolName(school.school.name);
  const schoolType = getSchoolType(school);

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
          {formattedName}
        </CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge
            variant={schoolType.variant}
            className={`gap-1 ${schoolType.className}`}
          >
            <MapPin className="h-3 w-3" />
            {schoolType.label}
          </Badge>
          {!school.active && (
            <Badge variant="destructive" className="gap-1">
              <XCircle className="h-3 w-3" />
              Inactive
            </Badge>
          )}
          {school.inscription_enabled === false && (
            <Badge variant="destructive" className="gap-1">
              <XCircle className="h-3 w-3" />
              Inscriptions fermées
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="py-3">
        <div className="flex items-center justify-start">
          <Link
            href={`/admin/schools?school_id=${school.school_id}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary/80 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Eye className="h-4 w-4" />
            Voir les détails
          </Link>
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-2"
            onClick={(e) => {
              e.stopPropagation();
              if (onEdit) {
                onEdit();
              }
            }}
          >
            <Edit className="h-4 w-4" />
            Modifier
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1 gap-2"
            onClick={(e) => {
              e.stopPropagation();
              if (onDelete) {
                onDelete();
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SchoolCard;
