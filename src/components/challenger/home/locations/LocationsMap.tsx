"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { createRoot } from "react-dom/client";
import "leaflet/dist/leaflet.css";
import { LocationComplete, MatchComplete } from "@/src/api/hyperionSchemas";
import { LocationInfoMarker } from "./LocationInfoMarker";

interface LocationsMapProps {
  locations: LocationComplete[];
  locationsWithMatches: Array<
    LocationComplete & {
      nextMatch?: MatchComplete;
      totalMatches: number;
      upcomingMatches?: MatchComplete[];
    }
  >;
  sports?: any[];
  schools?: any[];
  className?: string;
}

export function LocationsMap({
  locations,
  locationsWithMatches,
  sports,
  className = "h-[calc(100vh-15rem)] w-full",
}: LocationsMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const createLocationMarker = useCallback(
    (
      L: any,
      location: LocationComplete,
      locationWithMatches: any,
      sports?: any[],
    ) => {
      if (!location.latitude || !location.longitude) return null;

      const hasMatches = locationWithMatches?.totalMatches > 0;

      const markerDiv = document.createElement("div");
      markerDiv.className = "location-marker-container";
      markerDiv.style.zIndex = "10";
      markerDiv.style.position = "relative";

      const root = createRoot(markerDiv);
      root.render(
        <LocationInfoMarker
          location={location}
          hasMatches={hasMatches}
          totalMatches={locationWithMatches?.totalMatches || 0}
          nextMatch={locationWithMatches?.nextMatch}
          upcomingMatches={locationWithMatches?.upcomingMatches || []}
          sports={sports}
        />,
      );

      const customIcon = L.divIcon({
        html: markerDiv,
        className: "custom-location-marker",
        iconSize: [32, 40],
        iconAnchor: [32, 0],
      });

      const marker = L.marker([location.latitude, location.longitude], {
        icon: customIcon,
      });

      marker.on("click", (e: any) => {
        L.DomEvent.stopPropagation(e);
        if (mapInstanceRef.current) {
          const map = mapInstanceRef.current;
          const latlng = marker.getLatLng();
          // Offset upward so the popup (above the pin) is centered on screen
          const targetPoint = map.latLngToContainerPoint(latlng);
          const offsetPoint = L.point(targetPoint.x, targetPoint.y - 150);
          const offsetLatLng = map.containerPointToLatLng(offsetPoint);
          map.panTo(offsetLatLng, { animate: true });
        }
      });

      (marker as any)._reactRoot = root;

      return marker;
    },
    [],
  );

  const cleanupMarker = (marker: any) => {
    if (marker && (marker as any)._reactRoot) {
      const rootToCleanup = (marker as any)._reactRoot;
      setTimeout(() => {
        try {
          rootToCleanup.unmount();
        } catch (error) {
          console.warn("Error unmounting marker root:", error);
        }
      }, 0);
    }
    if (mapInstanceRef.current && marker) {
      mapInstanceRef.current.removeLayer(marker);
    }
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const container = mapRef.current;

    const initMap = async () => {
      const L = await import("leaflet");

      if ((container as any)._leaflet_id) {
        console.warn(
          "Map container already has a Leaflet instance, skipping initialization",
        );
        return;
      }

      const defaultCenter: [number, number] = [45.782871, 4.769279];

      mapInstanceRef.current = L.map(container).setView(defaultCenter, 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);

      // Render markers immediately when map is initialized
      locations.forEach((location) => {
        if (location.latitude && location.longitude) {
          const locationWithMatches = locationsWithMatches.find(
            (lwm) => lwm.id === location.id,
          );

          const marker = createLocationMarker(
            L,
            location,
            locationWithMatches,
            sports,
          );

          if (marker && mapInstanceRef.current) {
            marker.addTo(mapInstanceRef.current);
            markersRef.current.push(marker);
          }
        }
      });

      // Fit bounds to show all markers if we have valid locations
      if (locations.length > 0) {
        const validLocations = locations.filter(
          (loc) => loc.latitude && loc.longitude,
        );
        if (validLocations.length > 0 && markersRef.current.length > 0) {
          const group = new (L as any).featureGroup(markersRef.current);
          mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
        }
      }
    };

    initMap().catch(console.error);

    return () => {
      if (mapInstanceRef.current) {
        markersRef.current.forEach(cleanupMarker);

        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = [];
        mapInstanceRef.current = null;
      }
      if (mapRef.current) {
        mapRef.current.innerHTML = "";
        // eslint-disable-next-line
        delete (mapRef.current as any)._leaflet_id;
      }
    };
  }, [locations, locationsWithMatches, sports, createLocationMarker]);

  useEffect(() => {
    if (!mapInstanceRef.current || !locations) return;

    const updateMarkers = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      if (!mapInstanceRef.current) return;

      const L = await import("leaflet");

      markersRef.current.forEach(cleanupMarker);
      markersRef.current = [];

      locations.forEach((location) => {
        if (location.latitude && location.longitude) {
          const locationWithMatches = locationsWithMatches.find(
            (lwm) => lwm.id === location.id,
          );

          const marker = createLocationMarker(
            L,
            location,
            locationWithMatches,
            sports,
          );

          if (marker && mapInstanceRef.current) {
            marker.addTo(mapInstanceRef.current);
            markersRef.current.push(marker);
          }
        }
      });
    };

    updateMarkers().catch(console.error);
  }, [locations, locationsWithMatches, sports, createLocationMarker]);

  return (
    <div
      ref={mapRef}
      className={`rounded-lg border shadow-sm ${className}`}
      style={{ minHeight: "400px" }}
    />
  );
}
