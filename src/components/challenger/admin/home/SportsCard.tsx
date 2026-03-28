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
import { Sport } from "@/src/api/hyperionSchemas";

interface SportsCardProps {
  sports: Sport[];
}

export const SportsCard = ({ sports }: SportsCardProps) => {
  if (!sports || sports.length === 0) {
    return null;
  }

  const SportItem = ({ sport }: { sport: Sport }) => (
    <div className="flex items-center justify-between border-b pb-2 last:border-b-0">
      <span className="font-medium">{sport.name}</span>
      <div className="flex items-center gap-2">
        <Badge variant="outline">
          {sport.sport_category === "masculine"
            ? "Masculin"
            : sport.sport_category === "feminine"
              ? "Féminin"
              : "Mixte"}
        </Badge>
        <Badge variant={sport.active !== false ? "default" : "secondary"}>
          {sport.active !== false ? "Actif" : "Inactif"}
        </Badge>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sports Configurés</CardTitle>
        <CardDescription>
          Liste des {sports.length} sports disponibles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sports.slice(0, 3).map((sport) => (
            <SportItem key={sport.id} sport={sport} />
          ))}
          {sports.length > 3 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="link" className="p-0 h-auto text-xs">
                  Voir {sports.length - 3} de plus
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {sports.slice(3).map((sport) => (
                    <SportItem key={sport.id} sport={sport} />
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
