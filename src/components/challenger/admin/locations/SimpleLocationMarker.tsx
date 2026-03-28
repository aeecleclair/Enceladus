"use client";

import React from "react";
import { MapPin, Edit } from "lucide-react";
import { Button } from "@/src/components/ui/button";

interface SimpleLocationMarkerProps {
  locationName: string;
  onClick: () => void;
  address?: string;
  latitude: number;
  longitude: number;
}

export function SimpleLocationMarker({
  locationName,
  onClick,
  address,
  latitude,
  longitude,
}: SimpleLocationMarkerProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="relative" onClick={handleCardClick}>
      <div className="w-[220px] bg-white rounded-lg shadow-lg border p-1.5">
        <div className="text-center mb-1">
          <div className="flex items-center justify-center gap-2 mb-0.5">
            <h3 className="font-medium text-base text-gray-900 truncate">
              {locationName}
            </h3>
            <Button size="sm" onClick={handleEdit} className="w-6 h-6 p-0">
              <Edit className="h-3 w-3" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground truncate flex items-center justify-center gap-1">
            <MapPin className="h-4 w-4" />
            {address || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`}
          </p>
        </div>
      </div>

      {/* Triangular pointer at the bottom */}
      <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-2">
        <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[12px] border-l-transparent border-r-transparent border-t-white drop-shadow-sm" />
      </div>
    </div>
  );
}
