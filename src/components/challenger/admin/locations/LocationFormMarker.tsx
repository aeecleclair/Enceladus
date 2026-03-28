"use client";

import React, { useEffect } from "react";
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
import { MapPin, Save, X, Trash2, Navigation, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface LocationFormMarkerProps {
  isAdded: boolean;
  address?: string;
  form: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isCreateLoading?: boolean;
  isUpdateLoading?: boolean;
  isDeleteLoading?: boolean;
  onDelete?: () => void;
  editingLocation?: any;
}

export function LocationFormMarker({
  isAdded,
  address,
  form,
  onSubmit,
  onCancel,
  isCreateLoading = false,
  isUpdateLoading = false,
  isDeleteLoading = false,
  onDelete,
  editingLocation,
}: LocationFormMarkerProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCancel();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    form.trigger().then(() => {
      form.handleSubmit(onSubmit)(e);
    });
  };

  const getIcon = () => <MapPin className="h-4 w-4" />;

  return (
    <div className="relative" onClick={handleCardClick}>
      <div className="w-[400px] sm:w-[450px] bg-white rounded-lg shadow-lg border p-4">
        <div className="flex items-start gap-3 mb-4">
          <div className="bg-rose-500/10 p-2 rounded-full shrink-0">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1 mb-2">
              <h3 className="font-medium text-base">
                {editingLocation ? "Modifier le lieu" : "Nouveau lieu"}
              </h3>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-xs",
                    isAdded
                      ? "border-red-500 text-red-600"
                      : "border-green-500 text-green-600",
                  )}
                >
                  {isAdded ? "Existant" : "Nouveau"}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
            {address && (
              <p className="text-sm text-muted-foreground truncate">
                <MapPin className="h-3 w-3 inline mr-1 opacity-70" />
                {address}
              </p>
            )}
          </div>
        </div>

        <Separator className="mb-4" />

        <Form {...form}>
          <form onSubmit={handleFormSubmit} className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Nom du lieu *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Entrez le nom du lieu"
                      {...field}
                      className="h-8"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Entrez une description du lieu"
                      {...field}
                      className="h-16 resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Adresse</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Entrez l'adresse du lieu"
                      {...field}
                      className="h-8"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator className="my-3" />

            <div className={`grid grid-cols-${editingLocation ? 2 : 1} gap-2`}>
              <Button
                disabled={isCreateLoading || isUpdateLoading}
                className="flex items-center justify-center"
                onClick={handleFormSubmit}
              >
                <Check className="h-3 w-3 mr-1" />
                {isCreateLoading || isUpdateLoading
                  ? "..."
                  : editingLocation
                    ? "Modifier"
                    : "Créer"}
              </Button>

              {editingLocation && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleteLoading}
                  className="flex items-center justify-center"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  {isDeleteLoading ? "..." : "Supprimer"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>

      {/* Triangular pointer at the bottom */}
      <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-2">
        <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[12px] border-l-transparent border-r-transparent border-t-white drop-shadow-sm" />
      </div>
    </div>
  );
}
