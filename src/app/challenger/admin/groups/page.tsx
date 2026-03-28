"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { useGroups } from "@/src/hooks/useGroups";
import GroupCard from "@/src/components/admin/groups/GroupCard";
import UserDetail from "@/src/components/admin/groups/UserDetail";
import { DeleteConfirmationDialog } from "@/src/components/admin/groups/DeleteConfirmationDialog";
import { AddUserDialog } from "@/src/components/admin/groups/AddUserDialog";
import {
  UserPlus,
  Search,
  Users,
  Shield,
  Filter,
  Settings,
} from "lucide-react";
import { Skeleton } from "@/src/components/ui/skeleton";
import {
  CompetitionGroupType,
  UserGroupMembership,
  UserGroupMembershipComplete,
} from "@/src/api/hyperionSchemas";
import { AVAILABLE_GROUPS } from "@/src/infra/groups";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

export default function GroupsPage() {
  const router = useRouter();
  const searchParam = useSearchParams();

  const userId = searchParam.get("user_id");
  const groupParam =
    (searchParam.get("group_id") as CompetitionGroupType) ||
    ("schools_bds" as CompetitionGroupType);

  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    groups: groupUsers,
    createGroup,
    deleteGroup,
    isCreateLoading,
    isDeleteLoading,
    refetchGroups,
  } = useGroups({ group: groupParam });

  const selectedUser = userId
    ? groupUsers?.find((group_user) => group_user.user_id === userId)
    : undefined;

  const selectedGroupName =
    AVAILABLE_GROUPS.find((g) => g.id === groupParam)?.name || groupParam;

  const filteredUsers = useMemo(() => {
    if (!groupUsers) return [];

    if (!searchQuery) return groupUsers;

    return groupUsers.filter((user: UserGroupMembershipComplete) => {
      const searchTerm = searchQuery.toLowerCase();

      return (
        user.user.firstname?.toLowerCase().includes(searchTerm) ||
        user.user.name?.toLowerCase().includes(searchTerm) ||
        user.user.email?.toLowerCase().includes(searchTerm) ||
        user.user.school?.name?.toLowerCase().includes(searchTerm)
      );
    });
  }, [groupUsers, searchQuery]);

  const stats = useMemo(() => {
    return groupUsers?.length || 0;
  }, [groupUsers]);

  useEffect(() => {
    refetchGroups();
  }, [groupParam, refetchGroups]);

  const handleDelete = (userId: string) => {
    setDeleteUserId(userId);
  };

  const confirmDelete = () => {
    if (deleteUserId) {
      deleteGroup(deleteUserId, () => {
        if (deleteUserId === userId) {
          router.push(`/admin/groups?group_id=${groupParam}`);
        }
        setDeleteUserId(null);
      });
    }
  };

  const handleAddUser = (userId: string) => {
    createGroup(userId, () => {
      setIsAddUserOpen(false);
    });
  };

  return (
    <div className="flex w-full flex-col">
      {selectedUser ? (
        <UserDetail
          user={selectedUser}
          onEdit={() => {}}
          onRemoveFromGroup={() => handleDelete(selectedUser.user_id)}
        />
      ) : (
        <div className="space-y-6">
          {/* Header with title and action */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Groupes</h1>
              <p className="text-muted-foreground">Gérez les membres</p>
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="lg" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Changer de groupe
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {AVAILABLE_GROUPS.map((group) => (
                    <DropdownMenuItem
                      key={group.id}
                      onClick={() => {
                        router.push(`/admin/groups?group_id=${group.id}`);
                      }}
                      className={groupParam === group.id ? "bg-muted" : ""}
                    >
                      <div className="flex items-center gap-2">
                        {group.id === "schools_bds" ? (
                          <Users className="h-4 w-4" />
                        ) : (
                          <Settings className="h-4 w-4" />
                        )}
                        {group.name}
                        {groupParam === group.id && (
                          <Badge variant="secondary" className="ml-auto">
                            Actuel
                          </Badge>
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                size="lg"
                className="gap-2"
                onClick={() => setIsAddUserOpen(true)}
              >
                <UserPlus className="h-4 w-4" />
                Ajouter
              </Button>
            </div>
          </div>

          {/* Current Group Indicator */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {groupParam === "schools_bds" ? (
                  <Users className="h-6 w-6" />
                ) : (
                  <Settings className="h-6 w-6" />
                )}
                <div>
                  <h2 className="text-lg font-semibold">
                    Groupe actuel: {selectedGroupName}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Vous gérez actuellement les membres de ce groupe
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="gap-1">
                <Users className="h-3 w-3" />
                {stats} membre{stats !== 1 ? "s" : ""}
              </Badge>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Rechercher dans le groupe ${selectedGroupName}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Results info */}
          {searchQuery ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                {filteredUsers.length} utilisateur(s) trouvé(s)
                {searchQuery && ` pour "${searchQuery}"`}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                }}
                className="h-auto p-1 text-xs"
              >
                Effacer la recherche
              </Button>
            </div>
          ) : null}

          {/* Users Grid */}
          {filteredUsers && filteredUsers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredUsers.map((group_user) => (
                <GroupCard
                  key={group_user.user_id}
                  user={group_user}
                  onClick={() => {
                    router.push(
                      `/admin/groups?user_id=${group_user.user_id}&group_id=${groupParam}`,
                    );
                  }}
                  onRemove={() => handleDelete(group_user.user_id)}
                />
              ))}
            </div>
          ) : groupUsers ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery
                  ? "Aucun utilisateur trouvé"
                  : `Aucun utilisateur dans le groupe ${selectedGroupName}`}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "Essayez de modifier vos critères de recherche"
                  : `Commencez par ajouter votre premier utilisateur au groupe ${selectedGroupName}`}
              </p>
              {!searchQuery && (
                <Button
                  className="gap-2"
                  onClick={() => setIsAddUserOpen(true)}
                >
                  <UserPlus className="h-4 w-4" />
                  Ajouter au groupe {selectedGroupName}
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-[200px] w-full" />
                ))}
            </div>
          )}
        </div>
      )}

      <DeleteConfirmationDialog
        isOpen={!!deleteUserId}
        onOpenChange={(open) => !open && setDeleteUserId(null)}
        title="Retirer l'utilisateur du groupe"
        description="Êtes-vous sûr de vouloir retirer cet utilisateur du groupe ? Cette action est irréversible."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteUserId(null)}
        isLoading={isDeleteLoading}
      />

      <AddUserDialog
        isOpen={isAddUserOpen}
        setIsOpen={setIsAddUserOpen}
        onAddUser={handleAddUser}
        isLoading={isCreateLoading}
        groupName={selectedGroupName}
      />
    </div>
  );
}
