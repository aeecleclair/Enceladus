"use client";

import React, { useState, useMemo } from "react";
import { Search, School, UserCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { LoadingButton } from "@/src/components/custom/LoadingButton";
import { useGetUsersSearch } from "@/src/api/hyperionComponents";
import { useAuth } from "@/src/hooks/useAuth";
import { useSchools } from "@/src/hooks/useSchools";
import { useAssignSchool } from "@/src/hooks/useAssignSchool";
import { formatSchoolName } from "@/src/utils/schoolFormatting";
import { CoreUserSimple } from "@/src/api/hyperionSchemas";

export default function SchoolAssignPage() {
  const { token, isTokenExpired } = useAuth();
  const { filteredSchools } = useSchools();
  const { assignSchool, isAssignLoading } = useAssignSchool();

  const [query, setQuery] = useState("");
  const [selectedSchool, setSelectedSchool] = useState<Record<string, string>>(
    {},
  );
  const [assigningUserId, setAssigningUserId] = useState<string | null>(null);

  const {
    data: searchResults,
    isLoading: isSearching,
    refetch: refetchSearch,
  } = useGetUsersSearch(
    {
      headers: { Authorization: `Bearer ${token}` },
      queryParams: {
        query: query.trim() || "*",
        includedAccountTypes: ["external"],
      },
    },
    {
      enabled: !isTokenExpired() && query.trim().length >= 1,
      retry: false,
      refetchOnWindowFocus: false,
    },
  );

  const handleAssign = (user: CoreUserSimple) => {
    const schoolId = selectedSchool[user.id];
    if (!schoolId) return;
    setAssigningUserId(user.id);
    assignSchool(user.id, schoolId, () => {
      setAssigningUserId(null);
      setSelectedSchool((prev) => {
        const next = { ...prev };
        delete next[user.id];
        return next;
      });
      refetchSearch();
    });
  };

  return (
    <div className="flex w-full flex-col space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <School className="h-8 w-8 text-primary" />
          Assignation d&apos;école
        </h1>
        <p className="text-muted-foreground">
          Recherchez les utilisateurs sans école (compte externe) et
          assignez-leur un établissement.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Rechercher un utilisateur externe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, prénom..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {query.trim().length >= 1 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Résultats
              {searchResults && (
                <Badge variant="secondary" className="ml-2">
                  {searchResults.length} utilisateur
                  {searchResults.length !== 1 ? "s" : ""}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isSearching ? (
              <p className="text-muted-foreground text-center py-8">
                Recherche en cours…
              </p>
            ) : !searchResults || searchResults.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Aucun utilisateur externe trouvé pour &quot;{query}&quot;
              </p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Prénom</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>École à assigner</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchResults.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.name}
                        </TableCell>
                        <TableCell>{user.firstname}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.account_type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={selectedSchool[user.id] || ""}
                            onValueChange={(val) =>
                              setSelectedSchool((prev) => ({
                                ...prev,
                                [user.id]: val,
                              }))
                            }
                          >
                            <SelectTrigger className="w-[240px]">
                              <SelectValue placeholder="Sélectionner une école" />
                            </SelectTrigger>
                            <SelectContent>
                              {filteredSchools?.map((school) => (
                                <SelectItem key={school.id} value={school.id}>
                                  {formatSchoolName(school.name)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-center">
                          <LoadingButton
                            size="sm"
                            onClick={() => handleAssign(user)}
                            disabled={!selectedSchool[user.id]}
                            isLoading={
                              isAssignLoading && assigningUserId === user.id
                            }
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Assigner
                          </LoadingButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
