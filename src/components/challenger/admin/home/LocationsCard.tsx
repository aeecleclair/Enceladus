import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { Location } from "@/src/api/hyperionSchemas";

interface LocationsCardProps {
  locations: Location[];
}

export const LocationsCard = ({ locations }: LocationsCardProps) => {
  if (!locations || locations.length === 0) {
    return null;
  }

  const displayedLocations = locations.slice(0, 3);
  const remainingLocations = locations.slice(3);

  const LocationItem = ({
    location,
    isInPopover = false,
  }: {
    location: Location;
    isInPopover?: boolean;
  }) => (
    <div
      key={location.id}
      className={
        isInPopover
          ? "border-b pb-2 last:border-b-0"
          : "flex items-center justify-between border-b pb-2 last:border-b-0"
      }
    >
      <div className={isInPopover ? "" : "flex-1"}>
        <span className="font-medium">{location.name}</span>
        {location.address && (
          <p className="text-xs text-muted-foreground">{location.address}</p>
        )}
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lieux de Compétition</CardTitle>
        <CardDescription>
          Détails des {locations.length} lieux configurés
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {displayedLocations.map((location) => (
            <LocationItem key={location.id} location={location} />
          ))}
          {remainingLocations.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full mt-2">
                  Voir {remainingLocations.length} de plus
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-3">
                  <h4 className="font-medium">
                    Autres lieux ({remainingLocations.length})
                  </h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {remainingLocations.map((location) => (
                      <LocationItem
                        key={location.id}
                        location={location}
                        isInPopover={true}
                      />
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
