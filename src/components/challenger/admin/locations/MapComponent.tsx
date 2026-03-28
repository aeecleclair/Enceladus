"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { createRoot } from "react-dom/client";
import "leaflet/dist/leaflet.css";
import { SimpleLocationMarker } from "./SimpleLocationMarker";
import { LocationFormMarker } from "./LocationFormMarker";

interface MapComponentProps {
  onCoordinatesChange: (lat: number, lng: number, address: string) => void;
  onLocationEdit?: (location: any) => void;
  locations?: any[];
  form?: any;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  isCreating?: boolean;
  editingLocation?: any;
  isCreateLoading?: boolean;
  isUpdateLoading?: boolean;
  isDeleteLoading?: boolean;
  onDelete?: (id: string) => void;
}

export default function MapComponent({
  onCoordinatesChange,
  onLocationEdit,
  locations = [],
  form,
  onSubmit,
  onCancel,
  isCreating = false,
  editingLocation,
  isCreateLoading = false,
  isUpdateLoading = false,
  isDeleteLoading = false,
  onDelete,
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const addMarkerRef = useRef<any>(null);
  const locationMarkersRef = useRef<any[]>([]);
  const editMarkerRef = useRef<any>(null);

  const getLocationName = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      );
      const data = await response.json();

      if (data.display_name) {
        const address = data.address || {};
        return address.road && address.city
          ? `${address.road}, ${address.city}`
          : data.display_name.split(",").slice(0, 2).join(",").trim();
      }
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (error) {
      console.error("Error getting location name:", error);
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  const createLocationMarker = useCallback(
    (L: any, lat: number, lng: number, location: any) => {
      const markerDiv = document.createElement("div");
      markerDiv.className = "location-marker-container";

      const root = createRoot(markerDiv);
      root.render(
        <SimpleLocationMarker
          locationName={location.name || location.address || "Lieu sans nom"}
          address={location.address}
          latitude={lat}
          longitude={lng}
          onClick={() => {
            if (onLocationEdit) {
              onLocationEdit(location);
            }
          }}
        />,
      );

      const customIcon = L.divIcon({
        html: markerDiv,
        className: "location-marker-icon",
        iconSize: [220, 50],
        iconAnchor: [110, 85],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      marker.on("click", (e: any) => {
        L.DomEvent.stopPropagation(e);
      });

      (marker as any)._reactRoot = root;

      return marker;
    },
    [onLocationEdit],
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

      mapInstanceRef.current = L.map(container).setView(defaultCenter, 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);

      mapInstanceRef.current.on("click", async (e: any) => {
        const { lat, lng } = e.latlng;

        if (addMarkerRef.current) {
          cleanupMarker(addMarkerRef.current);
          addMarkerRef.current = null;
        }

        if (!editingLocation) {
          const name = await getLocationName(lat, lng);

          onCoordinatesChange(lat, lng, name);

          const markerDiv = document.createElement("div");
          markerDiv.className = "add-marker-container";

          const handleAddCancel = () => {
            if (addMarkerRef.current) {
              cleanupMarker(addMarkerRef.current);
              addMarkerRef.current = null;
            }

            if (onCancel) {
              onCancel();
            }
          };

          const root = createRoot(markerDiv);
          root.render(
            <LocationFormMarker
              isAdded={false}
              address={name}
              form={form}
              onSubmit={onSubmit || (() => {})}
              onCancel={handleAddCancel}
              isCreateLoading={isCreateLoading}
              isUpdateLoading={isUpdateLoading}
              isDeleteLoading={isDeleteLoading}
              editingLocation={null}
            />,
          );

          const customIcon = L.divIcon({
            html: markerDiv,
            className: "add-marker-icon",
            iconSize: [400, 380],
            iconAnchor: [200, 435],
          });

          addMarkerRef.current = L.marker([lat, lng], { icon: customIcon });

          addMarkerRef.current.on("click", (e: any) => {
            L.DomEvent.stopPropagation(e);
          });

          (addMarkerRef.current as any)._reactRoot = root;

          addMarkerRef.current.addTo(mapInstanceRef.current);

          const zoom = mapInstanceRef.current.getZoom();
          const pixelsToShift = 160;
          const pixelsPerDegree = (256 * Math.pow(2, zoom)) / 360;
          const latOffset = pixelsToShift / pixelsPerDegree;

          mapInstanceRef.current.setView([lat + latOffset, lng], zoom, {
            animate: true,
            duration: 0.5,
          });
        }
      });

      locations.forEach((location) => {
        if (location.latitude && location.longitude) {
          if (!editingLocation || editingLocation.id !== location.id) {
            const marker = createLocationMarker(
              L,
              location.latitude,
              location.longitude,
              location,
            );

            if (mapInstanceRef.current) {
              marker.addTo(mapInstanceRef.current);
              locationMarkersRef.current.push(marker);
            }
          }
        }
      });
    };

    initMap().catch(console.error);

    return () => {
      if (mapInstanceRef.current) {
        if (addMarkerRef.current) {
          cleanupMarker(addMarkerRef.current);
        }
        if (editMarkerRef.current) {
          cleanupMarker(editMarkerRef.current);
        }
        locationMarkersRef.current.forEach(cleanupMarker);

        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        addMarkerRef.current = null;
        editMarkerRef.current = null;
        locationMarkersRef.current = [];

        delete (container as any)._leaflet_id;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !locations) return;

    const updateLocationMarkers = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));

      if (!mapInstanceRef.current) return;

      const L = await import("leaflet");

      locationMarkersRef.current.forEach(cleanupMarker);
      locationMarkersRef.current = [];

      locations.forEach((location) => {
        if (location.latitude && location.longitude) {
          if (!editingLocation || editingLocation.id !== location.id) {
            const marker = createLocationMarker(
              L,
              location.latitude,
              location.longitude,
              location,
            );

            if (mapInstanceRef.current) {
              marker.addTo(mapInstanceRef.current);
              locationMarkersRef.current.push(marker);
            }
          }
        }
      });
    };

    updateLocationMarkers().catch(console.error);
  }, [locations, editingLocation, createLocationMarker]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const updateEditMarker = async () => {
      const L = await import("leaflet");

      if (editMarkerRef.current) {
        cleanupMarker(editMarkerRef.current);
        editMarkerRef.current = null;
      }

      if (addMarkerRef.current) {
        cleanupMarker(addMarkerRef.current);
        addMarkerRef.current = null;
      }

      if (
        editingLocation &&
        editingLocation.latitude &&
        editingLocation.longitude
      ) {
        const locationName =
          editingLocation.name || editingLocation.address || "Lieu sans nom";

        const handleEditCancel = () => {
          if (editMarkerRef.current) {
            cleanupMarker(editMarkerRef.current);
            editMarkerRef.current = null;
          }

          if (onCancel) {
            onCancel();
          }
        };

        const markerDiv = document.createElement("div");
        markerDiv.className = "edit-marker-container";

        const root = createRoot(markerDiv);
        root.render(
          <LocationFormMarker
            isAdded={true}
            address={editingLocation.address || locationName}
            form={form}
            onSubmit={onSubmit || (() => {})}
            onCancel={handleEditCancel}
            isCreateLoading={isCreateLoading}
            isUpdateLoading={isUpdateLoading}
            isDeleteLoading={isDeleteLoading}
            onDelete={onDelete ? () => onDelete(editingLocation.id) : undefined}
            editingLocation={editingLocation}
          />,
        );

        const customIcon = L.divIcon({
          html: markerDiv,
          className: "edit-marker-icon",
          iconSize: [400, 380],
          iconAnchor: [200, 435],
        });

        editMarkerRef.current = L.marker(
          [editingLocation.latitude, editingLocation.longitude],
          { icon: customIcon },
        );

        editMarkerRef.current.on("click", (e: any) => {
          L.DomEvent.stopPropagation(e);
        });

        (editMarkerRef.current as any)._reactRoot = root;

        if (mapInstanceRef.current) {
          editMarkerRef.current.addTo(mapInstanceRef.current);

          const zoom = mapInstanceRef.current.getZoom();
          const pixelsToShift = 160;
          const pixelsPerDegree = (256 * Math.pow(2, zoom)) / 360;
          const latOffset = pixelsToShift / pixelsPerDegree;

          mapInstanceRef.current.setView(
            [editingLocation.latitude + latOffset, editingLocation.longitude],
            zoom,
            {
              animate: true,
              duration: 0.5,
            },
          );
        }
      }
    };

    updateEditMarker().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingLocation]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (!isCreating && addMarkerRef.current) {
      cleanupMarker(addMarkerRef.current);
      addMarkerRef.current = null;
    }
  }, [isCreating]);

  return (
    <div
      ref={mapRef}
      className="h-full w-full rounded-md border border-input overflow-hidden"
      style={{ zIndex: 0 }}
    />
  );
}
