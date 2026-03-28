"use client";

import { LocationComplete } from "@/src/api/hyperionSchemas";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Edit, MapPin, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface LocationCardProps {
  location: LocationComplete;
  onDelete: (locationId: string) => void;
}

export function LocationCard({ location, onDelete }: LocationCardProps) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/admin/locations/edit?location_id=${location.id}`);
  };

  const handleDelete = () => {
    onDelete(location.id);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {location.name}
        </CardTitle>
        {location.description && (
          <CardDescription>{location.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {location.address && (
            <p className="text-sm text-muted-foreground">
              <strong>Adresse:</strong> {location.address}
            </p>
          )}
          {location.latitude && location.longitude && (
            <p className="text-sm text-muted-foreground">
              <strong>Coordonnées:</strong> {location.latitude.toFixed(4)},{" "}
              {location.longitude.toFixed(4)}
            </p>
          )}
          {location.matches && location.matches.length > 0 && (
            <p className="text-sm text-muted-foreground">
              <strong>Matchs associés:</strong> {location.matches.length}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={handleEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Modifier
        </Button>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          Supprimer
        </Button>
      </CardFooter>
    </Card>
  );
}
