"use client";

import React, { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Separator } from "@/src/components/ui/separator";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import {
  MapPin,
  Check,
  Trash2,
  Navigation,
  ExternalLink,
  Edit,
  Save,
  X,
  Plus,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { locationSchema, LocationFormData } from "@/src/forms/location";
import { LocationComplete } from "@/src/api/hyperionSchemas";

interface CustomMarkerProps {
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
  existingLocation?: LocationComplete;
  isExisting?: boolean;
  isAdded?: boolean;
  onCoordinatesChange?: (lat: number, lng: number) => void;
  onLocationAdd?: (
    lat: number,
    lng: number,
    name: string,
    address: string,
  ) => void;
  onLocationEdit?: (location: LocationComplete) => void;
  onLocationCreate?: (data: LocationFormData) => void;
  onLocationUpdate?: (locationId: string, data: LocationFormData) => void;
  onLocationDelete?: (lat: number, lng: number) => void;
  onCancel?: () => void;
  form?: any;
  isCreateLoading?: boolean;
  isUpdateLoading?: boolean;
  isDeleteLoading?: boolean;
  onDelete?: (id: string) => void;
  showForm?: boolean;
}

export function CustomMarker({
  latitude,
  longitude,
  name,
  address,
  existingLocation,
  isExisting = false,
  isAdded = false,
  onCoordinatesChange,
  onLocationAdd,
  onLocationEdit,
  onLocationCreate,
  onLocationUpdate,
  onLocationDelete,
  onCancel,
  form,
  isCreateLoading = false,
  isUpdateLoading = false,
  isDeleteLoading = false,
  onDelete,
  showForm = false,
}: CustomMarkerProps) {
  const [isFormExpanded, setIsFormExpanded] = useState(showForm || !isExisting);

  const localForm = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: existingLocation?.name || name || "",
      description: existingLocation?.description || "",
      address: existingLocation?.address || address || "",
      latitude: latitude,
      longitude: longitude,
    },
  });

  const activeForm = form || localForm;

  const handleSubmit = async (data: LocationFormData) => {
    try {
      if (existingLocation) {
        await onLocationUpdate?.(existingLocation.id, data);
      } else {
        await onLocationCreate?.({
          ...data,
          latitude,
          longitude,
        });
      }
      setIsFormExpanded(false);
    } catch (error) {
      console.error("Error submitting location:", error);
    }
  };

  const handleCancel = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setIsFormExpanded(false);
    if (onCancel) {
      onCancel();
    }
  };

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (existingLocation) {
      onLocationEdit?.(existingLocation);
      setIsFormExpanded(true);
    }
  };

  const handleDirections = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
      "_blank",
    );
  };

  const getIcon = () => {
    return <MapPin className="h-4 w-4 text-rose-600" />;
  };

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <div
        className={cn(
          "bg-white rounded-lg shadow-lg border p-4 relative z-10",
          "w-[350px] sm:w-[400px]", // Increased width for better form display
        )}
      >
        {isFormExpanded ? (
          <div>
            {/* Header with icon and title */}
            <div className="flex items-start gap-3 mb-4">
              <div className="bg-rose-500/10 p-2 rounded-full shrink-0">
                {getIcon()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="font-medium text-base truncate">
                    {existingLocation ? "Modifier le lieu" : "Nouveau lieu"}
                  </h3>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      existingLocation
                        ? "border-amber-500 text-amber-600"
                        : "border-blue-500 text-blue-600",
                    )}
                  >
                    {existingLocation ? "Edition" : "Création"}
                  </Badge>
                </div>
                {address && (
                  <p className="text-sm text-muted-foreground truncate mt-1">
                    <MapPin className="h-3 w-3 inline mr-1 opacity-70" />
                    {address}
                  </p>
                )}
              </div>
            </div>

            <Separator className="my-3" />

            {/* Form */}
            <Form {...activeForm}>
              <form
                onSubmit={activeForm.handleSubmit(handleSubmit)}
                className="space-y-3"
              >
                <FormField
                  control={activeForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Nom du lieu *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Entrez le nom du lieu"
                          {...field}
                          className="h-8 text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={activeForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Entrez une description du lieu"
                          {...field}
                          className="h-16 resize-none text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={activeForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Adresse
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Adresse du lieu"
                          {...field}
                          className="h-8 text-sm"
                          readOnly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator className="my-3" />

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isCreateLoading || isUpdateLoading}
                    className="flex items-center justify-center"
                  >
                    <X className="h-3 w-3 mr-1.5" />
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isCreateLoading || isUpdateLoading}
                    className="flex items-center justify-center"
                  >
                    {isCreateLoading || isUpdateLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1.5" />
                        {existingLocation ? "Modification..." : "Création..."}
                      </>
                    ) : (
                      <>
                        <Save className="h-3 w-3 mr-1.5" />
                        {existingLocation ? "Modifier" : "Créer"}
                      </>
                    )}
                  </Button>
                </div>

                <div className="mt-3 pt-2 border-t text-xs text-muted-foreground">
                  <div className="flex justify-between items-center">
                    <span className="truncate max-w-[170px]">
                      {existingLocation
                        ? `ID: ${existingLocation.id.substring(0, 8)}...`
                        : "Nouveau lieu"}
                    </span>
                    <span className="text-right">
                      {latitude.toFixed(4)}, {longitude.toFixed(4)}
                    </span>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        ) : (
          <div>
            <div className="flex items-start gap-3">
              <div className="bg-rose-500/10 p-2 rounded-full shrink-0">
                {getIcon()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="font-medium text-base truncate">
                    {name || existingLocation?.name || "Nouveau lieu"}
                  </h3>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      isExisting
                        ? "border-green-500 text-green-600"
                        : "border-blue-500 text-blue-600",
                    )}
                  >
                    {isExisting ? "Existant" : "Nouveau"}
                  </Badge>
                </div>
                {address && (
                  <p className="text-sm text-muted-foreground truncate mt-1">
                    <MapPin className="h-3 w-3 inline mr-1 opacity-70" />
                    {address}
                  </p>
                )}
              </div>
            </div>

            <Separator className="my-3" />

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center justify-center"
                onClick={handleDirections}
              >
                <Navigation className="h-4 w-4 mr-1.5" />
                Directions
              </Button>

              {isExisting ? (
                <Button
                  onClick={handleAction}
                  size="sm"
                  variant="default"
                  className="flex items-center justify-center"
                >
                  <Edit className="h-4 w-4 mr-1.5" />
                  Modifier
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center justify-center"
                  onClick={() => setIsFormExpanded(true)}
                >
                  <Star className="h-4 w-4 mr-1.5" />
                  Save
                </Button>
              )}
            </div>

            <div className="mt-3 pt-2 border-t text-xs text-muted-foreground">
              <div className="flex justify-between items-center">
                <span className="truncate max-w-[170px]">
                  {existingLocation
                    ? `ID: ${existingLocation.id.substring(0, 8)}...`
                    : "Nouveau"}
                </span>
                <span className="text-right">
                  {latitude.toFixed(4)}, {longitude.toFixed(4)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Triangular pointer at the bottom */}
      <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-2">
        <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[12px] border-l-transparent border-r-transparent border-t-white drop-shadow-sm" />
      </div>
    </div>
  );
}
