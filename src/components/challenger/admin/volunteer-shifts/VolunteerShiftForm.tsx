"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  volunteerShiftFormSchema,
  VolunteerShiftFormSchema,
} from "../../../forms/volunteerShift";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { LoadingButton } from "../../custom/LoadingButton";
import { DateTimePicker } from "../../custom/DateTimePicker";
import { useVolunteerShifts } from "../../../hooks/useVolunteerShifts";
import { useLocations } from "../../../hooks/useLocations";
import { useAuth } from "../../../hooks/useAuth";
import { useUserSearch } from "../../../hooks/useUsersSearch";
import {
  VolunteerShiftComplete,
  VolunteerShiftBase,
} from "../../../api/hyperionSchemas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Check, ChevronsUpDown, User } from "lucide-react";

interface VolunteerShiftFormProps {
  shiftId?: string | null;
  prefilledDate?: Date | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function VolunteerShiftForm({
  shiftId,
  prefilledDate,
  onClose,
  onSuccess,
}: VolunteerShiftFormProps) {
  const {
    volunteerShifts,
    createVolunteerShift,
    updateVolunteerShift,
    isCreateLoading,
    isUpdateLoading,
  } = useVolunteerShifts();

  const { locations } = useLocations();
  const { userId } = useAuth();

  const [managerQuery, setManagerQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("*"); // Initialize with "*" to load users immediately
  const [isManagerPopoverOpen, setIsManagerPopoverOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState<any>(null);
  const { userSearch, isLoading: isSearchLoading } = useUserSearch({
    query: debouncedQuery,
  });

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(managerQuery || "*");
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [managerQuery]);

  // Reset to show all users when popover reopens
  useEffect(() => {
    if (isManagerPopoverOpen && managerQuery === "") {
      setDebouncedQuery("*");
    }
  }, [isManagerPopoverOpen, managerQuery]);

  const isEditing = !!shiftId;
  const shift = isEditing
    ? volunteerShifts?.find((s: VolunteerShiftComplete) => s.id === shiftId)
    : null;

  // Initialize selected manager for editing
  useEffect(() => {
    if (isEditing && shift?.manager && !selectedManager) {
      setSelectedManager(shift.manager);
    }
  }, [isEditing, shift, selectedManager]);

  const form = useForm<VolunteerShiftFormSchema>({
    resolver: zodResolver(volunteerShiftFormSchema),
    defaultValues: {
      name: shift?.name || "",
      description: shift?.description || "",
      value: shift?.value || 1,
      start_time: shift
        ? new Date(shift.start_time)
        : prefilledDate || new Date(),
      end_time: shift
        ? new Date(shift.end_time)
        : new Date((prefilledDate || new Date()).getTime() + 60 * 60 * 1000), // 2 hours later
      location: shift?.location || "",
      max_volunteers: shift?.max_volunteers || 5,
    },
  });

  const onSubmit = (data: VolunteerShiftFormSchema) => {
    const shiftData: VolunteerShiftBase = {
      name: data.name,
      manager_id: data.manager_id,
      description: data.description || null,
      value: data.value,
      start_time: data.start_time.toISOString(),
      end_time: data.end_time.toISOString(),
      location: data.location,
      max_volunteers: data.max_volunteers,
    };

    if (isEditing && shiftId) {
      updateVolunteerShift(shiftId, shiftData, onSuccess);
    } else {
      createVolunteerShift(shiftData, onSuccess);
    }
  };

  const isLoading = isCreateLoading || isUpdateLoading;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier le créneau" : "Nouveau créneau bénévole"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Nom du créneau *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Accueil des participants"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="manager_id"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Responsable du créneau *</FormLabel>
                    <Popover
                      open={isManagerPopoverOpen}
                      onOpenChange={setIsManagerPopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={`w-full justify-between ${!field.value ? "text-muted-foreground" : ""}`}
                            aria-expanded={isManagerPopoverOpen}
                          >
                            {field.value ? (
                              <>
                                <User className="mr-2 h-4 w-4" />
                                {selectedManager
                                  ? `${selectedManager.firstname} ${selectedManager.name}${selectedManager.nickname ? ` (${selectedManager.nickname})` : ""}`
                                  : shift?.manager
                                    ? `${shift.manager.firstname} ${shift.manager.name}`
                                    : "Responsable sélectionné"}
                              </>
                            ) : (
                              <>
                                <User className="mr-2 h-4 w-4" />
                                Sélectionner un responsable
                              </>
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command shouldFilter={false}>
                          <CommandInput
                            placeholder="Rechercher un utilisateur..."
                            value={managerQuery}
                            onValueChange={(value) => {
                              setManagerQuery(value);
                            }}
                          />
                          <CommandList>
                            {isSearchLoading ? (
                              <CommandEmpty>Recherche en cours...</CommandEmpty>
                            ) : !userSearch || userSearch.length === 0 ? (
                              <CommandEmpty>
                                Aucun utilisateur trouvé.
                              </CommandEmpty>
                            ) : (
                              <CommandGroup>
                                {userSearch.map((user) => (
                                  <CommandItem
                                    key={user.id}
                                    value={user.id}
                                    onSelect={() => {
                                      field.onChange(user.id);
                                      setSelectedManager(user);
                                      setIsManagerPopoverOpen(false);
                                      setManagerQuery("");
                                      setDebouncedQuery("*"); // Reset for next time
                                    }}
                                  >
                                    <Check
                                      className={`mr-2 h-4 w-4 ${
                                        field.value === user.id
                                          ? "opacity-100"
                                          : "opacity-0"
                                      }`}
                                    />
                                    <div className="flex items-center">
                                      <User className="mr-2 h-4 w-4" />
                                      <div>
                                        <div className="font-medium">
                                          {user.firstname} {user.name}
                                          {user.nickname && (
                                            <span className="text-muted-foreground ml-1">
                                              ({user.nickname})
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            )}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description détaillée du créneau..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure de début *</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        date={field.value}
                        setDate={field.onChange}
                        fromDate={new Date()}
                        toDate={
                          new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
                        } // 1 year from now
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure de fin *</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        date={field.value}
                        setDate={field.onChange}
                        fromDate={new Date()}
                        toDate={
                          new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
                        } // 1 year from now
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lieu</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: W1bis" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_volunteers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre maximum de bénévoles *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Valeur en points *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.1"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <LoadingButton type="submit" isLoading={isLoading}>
                {isEditing ? "Modifier" : "Créer"}
              </LoadingButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
