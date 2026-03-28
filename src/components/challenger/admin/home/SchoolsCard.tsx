import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { SchoolExtension } from "@/src/api/hyperionSchemas";
import { formatSchoolName } from "@/src/utils/schoolFormatting";

interface SchoolsCardProps {
  schools: SchoolExtension[];
}

export const SchoolsCard = ({ schools }: SchoolsCardProps) => {
  if (!schools || schools.length === 0) {
    return null;
  }

  // Filter out the "no school" entry
  const NoSchoolId = "dce19aa2-8863-4c93-861e-fb7be8f610ed";
  const filteredSchools = schools.filter(
    (school) => school.school_id !== NoSchoolId,
  );

  if (filteredSchools.length === 0) {
    return null;
  }

  const SchoolItem = ({ school }: { school: SchoolExtension }) => (
    <div className="flex items-center justify-between border-b pb-2 last:border-b-0">
      <span className="font-medium">
        {formatSchoolName(school.school.name)}
      </span>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Écoles Configurées</CardTitle>
        <CardDescription>
          Liste des {filteredSchools.length} écoles participantes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {filteredSchools.slice(0, 3).map((school) => (
            <SchoolItem key={school.school_id} school={school} />
          ))}
          {filteredSchools.length > 3 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="link" className="p-0 h-auto text-xs">
                  Voir {filteredSchools.length - 3} de plus
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredSchools.slice(3).map((school) => (
                    <SchoolItem key={school.school_id} school={school} />
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
