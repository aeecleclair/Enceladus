"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Check, Loader2, Search, UserPlus } from "lucide-react";
import { useUserSearch } from "@/src/hooks/useUsersSearch";
import { cn } from "@/lib/utils";
import { CoreUserSimple } from "@/src/api/hyperionSchemas";

interface AddUserDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onAddUser: (userId: string) => void;
  isLoading: boolean;
  groupName: string;
}

export function AddUserDialog({
  isOpen,
  setIsOpen,
  onAddUser,
  isLoading,
  groupName,
}: AddUserDialogProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedUserData, setSelectedUserData] =
    useState<CoreUserSimple | null>(null);

  const {
    userSearch,
    refetchUsers,
    isLoading: isApiLoading,
  } = useUserSearch({
    query: searchQuery,
  });

  // Update selected user data when userId changes
  useEffect(() => {
    if (selectedUserId && userSearch) {
      const user = userSearch.find((u) => u.id === selectedUserId);
      if (user) {
        setSelectedUserData(user);
      }
    } else if (!selectedUserId) {
      setSelectedUserData(null);
    }
  }, [selectedUserId, userSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserId) {
      onAddUser(selectedUserId);
      setSelectedUserId("");
      setSelectedUserData(null);
      setSearchQuery("");
    }
  };

  const resetDialog = () => {
    setSelectedUserId("");
    setSelectedUserData(null);
    setSearchQuery("");
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          resetDialog();
        }
      }}
    >
      <DialogContent className="lg:max-w-lg max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Ajouter un utilisateur au groupe {groupName}
          </DialogTitle>
          <DialogDescription>
            Recherchez un utilisateur que vous souhaitez ajouter à ce groupe.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="user-search">Rechercher un utilisateur</Label>
              <div className="flex flex-col space-y-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="user-search"
                    className="pl-8"
                    placeholder="Rechercher un utilisateur..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="border rounded-md max-h-80 overflow-y-auto">
                  {isApiLoading ? (
                    <div className="p-4 text-center">
                      <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Recherche en cours...
                      </p>
                    </div>
                  ) : userSearch && userSearch.length > 0 ? (
                    <ul className="divide-y">
                      {userSearch.map((user) => (
                        <li
                          key={user.id}
                          className={cn(
                            "p-3 cursor-pointer hover:bg-muted/50 flex items-center justify-between",
                            selectedUserId === user.id && "bg-muted",
                          )}
                          onClick={() => setSelectedUserId(user.id)}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {user.firstname} {user.name}{" "}
                              {user.nickname ? `(${user.nickname})` : ""}
                            </span>
                          </div>
                          {selectedUserId === user.id && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : searchQuery && searchQuery.length > 1 ? (
                    <div className="p-3 text-center text-muted-foreground">
                      Aucun utilisateur trouvé
                    </div>
                  ) : (
                    <div className="p-3 text-center text-muted-foreground">
                      Tapez au moins 2 caractères pour rechercher
                    </div>
                  )}
                </div>

                {selectedUserData && (
                  <div className="p-3 mt-2 bg-primary/10 border border-primary/20 rounded-md">
                    <p className="text-sm font-medium text-primary">
                      Utilisateur sélectionné:
                    </p>
                    <p className="text-sm mt-1">
                      {selectedUserData.firstname} {selectedUserData.name}{" "}
                      {selectedUserData.nickname
                        ? `(${selectedUserData.nickname})`
                        : ""}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={!selectedUserId || isLoading}
              className="flex items-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Chargement...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Ajouter
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
