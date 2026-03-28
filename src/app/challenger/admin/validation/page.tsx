"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useSchoolParticipants } from "@/src/hooks/useSchoolParticipants";
import { useMemo, useEffect, useState } from "react";
import { ParticipantData } from "@/src/components/admin/validation/ParticipantDataTable";
import { useSports } from "@/src/hooks/useSports";
import { useSportsQuota } from "@/src/hooks/useSportsQuota";
import { useUser } from "@/src/hooks/useUser";
import { useSportSchools } from "@/src/hooks/useSportSchools";
import { formatSchoolName } from "@/src/utils/schoolFormatting";
import { Badge } from "@/src/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { useSchoolsGeneralQuota } from "@/src/hooks/useSchoolsGeneralQuota";
import { useSchoolsProductQuota } from "@/src/hooks/useSchoolsProductQuota";
import { useProducts } from "@/src/hooks/useProducts";
import { useCompetitionUsers } from "@/src/hooks/useCompetitionUsers";
import { CompetitionUser } from "@/src/api/hyperionSchemas";
import { ValidationTab } from "@/src/components/admin/validation/ValidationTab";
import { useSchoolsPurchases } from "@/src/hooks/useSchoolsPurchases";
import { useParticipant } from "@/src/hooks/useParticipant";
import { RequiredPurchase } from "@/src/components/admin/validation/UserProductsCell";

const Dashboard = () => {
  const router = useRouter();
  const { sportSchools } = useSportSchools();
  const { sports } = useSports();
  const { me: currentUser, isAdmin } = useUser();

  const [schoolCompetitionUsersCounter, setSchoolCompetitionUsersCounter] =
    useState<string[][]>([]);

  const searchParam = useSearchParams();
  const schoolId = searchParam.get("school_id");
  const { schoolsGeneralQuota, refetchSchoolsGeneralQuota } =
    useSchoolsGeneralQuota({
      schoolId: schoolId || undefined,
    });

  const { schoolsProductQuota, refetchSchoolsProductQuota } =
    useSchoolsProductQuota({
      schoolId: schoolId || undefined,
    });

  const { products } = useProducts();

  const userSchoolId = currentUser?.school_id;
  const canAccessSchool = isAdmin() || schoolId === userSchoolId;

  const effectiveSchoolId = schoolId || userSchoolId;

  const { schoolParticipants, refetchParticipantSchools } =
    useSchoolParticipants({
      schoolId: effectiveSchoolId || "",
    });
  const { schoolsPurchases, refetchSchoolsPurchases } = useSchoolsPurchases({
    schoolId: effectiveSchoolId || "",
  });

  const {
    competitionUsers,
    validateCompetitionUser,
    isValidateLoading,
    invalidateCompetitionUser,
    isInvalidateLoading,
    deleteCompetitionUser,
    isDeleteLoading,
    cancelCompetitionUser,
  } = useCompetitionUsers();

  const { deleteParticipant } = useParticipant();

  const { sportsQuota, refetchSportsQuota } = useSportsQuota({
    sportId: undefined,
  });

  const onValidate = (userId: string) => {
    validateCompetitionUser(userId, () => {});
  };

  const onInvalidate = (userId: string) => {
    invalidateCompetitionUser(userId, () => {});
  };

  const onDelete = (userId: string, sportId: string, isAthlete: boolean) => {
    if (isAthlete)
      deleteParticipant(sportId, userId, () => {
        deleteCompetitionUser(userId, () => {});
      });
    else deleteCompetitionUser(userId, () => {});
  };

  const onCancel = (userId: string) => {
    cancelCompetitionUser(userId, () => {});
  };

  const participantTableData: ParticipantData[] = useMemo(() => {
    return (
      competitionUsers
        ?.filter((user) => user.user.school_id === effectiveSchoolId)
        .map((user) => {
          const getSportName = (sportId: string) => {
            return sports?.find((s) => s.id === sportId)?.name || sportId;
          };

          const getParticipantType = (user: CompetitionUser) => {
            const types = [];
            if (user.is_athlete) types.push("Athlète");
            if (user.is_pompom) types.push("Pompom");
            if (user.is_fanfare) types.push("Fanfare");
            if (user.is_cameraman) types.push("Cameraman");
            // Handle volunteer - either explicit or no other roles
            if (
              !user.is_athlete &&
              !user.is_pompom &&
              !user.is_fanfare &&
              !user.is_cameraman
            ) {
              types.push("Bénévole");
            }
            return types.join(", ");
          };

          const userPurchases = schoolsPurchases
            ? schoolsPurchases[user.user_id]
              ? schoolsPurchases[user.user_id]
              : []
            : [];
          const hasPaid = userPurchases
            .filter((purchase) => {
              const product = products?.find(
                (p) => p.id === purchase.product_variant.product_id,
              );
              return product && product.required;
            })
            .some((purchase) => purchase.validated);

          const partialPaid = userPurchases.some(
            (purchase) => !purchase.validated,
          );

          console.log("userPurchases", userPurchases);

          var requiredPurchases: RequiredPurchase = [];

          userPurchases.forEach((purchase) => {
            const product = products?.find((p) =>
              (p?.variants ?? []).find(
                (v) => v.id === purchase.product_variant_id,
              ),
            );

            const variant = (product?.variants ?? []).find(
              (v) => v.id === purchase.product_variant_id,
            );

            if (variant && product && product.required)
              requiredPurchases.push({
                product_variant_id: purchase.product_variant_id,
                quantity: purchase.quantity,
                validated: purchase.validated,
                variant: variant,
                product: product,
              });
          });

          console.log("requiredPurchases", requiredPurchases);

          const requiredProductNames = requiredPurchases
            .map((p) => p.product?.name)
            .filter(Boolean) as string[];

          if (user.is_athlete) {
            const participant = schoolParticipants?.find(
              (p) => p.user_id === user.user_id,
            );
            return {
              userId: user.user_id,
              sportId: participant?.sport_id || "",
              sportName: getSportName(participant?.sport_id || ""),
              fullName: `${user.user?.firstname || ""} ${user.user?.name || ""}`,
              email: user.user?.email || "",
              isLicenseValid: participant?.is_license_valid || false,
              teamId: participant?.team_id || "",
              teamName: participant?.team.name || "",
              isCaptain: participant?.team.captain_id === user.user_id || false,
              isSubstitute: participant?.substitute || false,
              isValidated: user.validated || false,
              participantType: getParticipantType(user),
              hasPaid: hasPaid,
              partialPaid: partialPaid,
              allowPictures: user.allow_pictures || false,
              requiredPurchases: requiredPurchases,
              requiredProductNames: requiredProductNames,
            };
          }
          return {
            userId: user.user_id,
            sportId: undefined,
            sportName: undefined,
            fullName: `${user.user?.firstname || ""} ${user.user?.name || ""}`,
            email: user.user?.email || "",
            isLicenseValid: undefined,
            teamId: undefined,
            teamName: undefined,
            isCaptain: false,
            isSubstitute: false,
            isValidated: user.validated || false,
            participantType: getParticipantType(user),
            hasPaid: hasPaid,
            partialPaid: partialPaid,
            allowPictures: user.allow_pictures || false,
            requiredPurchases: requiredPurchases,
            requiredProductNames: requiredProductNames,
          };
        }) || []
    );
  }, [
    competitionUsers,
    sports,
    schoolParticipants,
    effectiveSchoolId,
    schoolsPurchases,
    products,
  ]);

  const validatedCounts: Record<string, number> = useMemo(() => {
    const counts: Record<string, number> = {
      athlete_quota: 0,
      cameraman_quota: 0,
      pompom_quota: 0,
      fanfare_quota: 0,
      athlete_cameraman_quota: 0,
      athlete_pompom_quota: 0,
      athlete_fanfare_quota: 0,
      non_athlete_cameraman_quota: 0,
      non_athlete_pompom_quota: 0,
      non_athlete_fanfare_quota: 0,
    };
    participantTableData.forEach((p) => {
      if (p.isValidated) {
        if (p.participantType.includes("Athlète")) counts.athlete_quota++;
        if (p.participantType.includes("Cameraman")) counts.cameraman_quota++;
        if (p.participantType.includes("Pompom")) counts.pompom_quota++;
        if (p.participantType.includes("Fanfare")) counts.fanfare_quota++;

        if (
          p.participantType.includes("Athlète") &&
          p.participantType.includes("Cameraman")
        )
          counts.athlete_cameraman_quota++;
        if (
          p.participantType.includes("Athlète") &&
          p.participantType.includes("Pompom")
        )
          counts.athlete_pompom_quota++;
        if (
          p.participantType.includes("Athlète") &&
          p.participantType.includes("Fanfare")
        )
          counts.athlete_fanfare_quota++;
        if (
          !p.participantType.includes("Athlète") &&
          p.participantType.includes("Cameraman")
        )
          counts.non_athlete_cameraman_quota++;
        if (
          !p.participantType.includes("Athlète") &&
          p.participantType.includes("Pompom")
        )
          counts.non_athlete_pompom_quota++;
        if (
          !p.participantType.includes("Athlète") &&
          p.participantType.includes("Fanfare")
        )
          counts.non_athlete_fanfare_quota++;
      }
    });
    return counts;
  }, [participantTableData]);

  const schoolsGeneralQuotaUsed: Record<string, number> = useMemo(() => {
    const used: Record<string, number> = {};
    competitionUsers
      ?.filter((user) => user.user.school_id === effectiveSchoolId)
      .map((user) => {
        const userPurchases = schoolsPurchases
          ? schoolsPurchases[user.user_id]
            ? schoolsPurchases[user.user_id]
            : []
          : [];
        userPurchases.forEach((purchase) => {
          const product = products?.find((p) =>
            (p?.variants ?? []).find(
              (v) => v.id === purchase.product_variant_id,
            ),
          );

          const variant = (product?.variants ?? []).find(
            (v) => v.id === purchase.product_variant_id,
          );

          if (variant && product && product.required)
            used[product.id] = (used[product.id] || 0) + 1;
        });
      });
    return used;
  }, [competitionUsers, effectiveSchoolId, products, schoolsPurchases]);

  useEffect(() => {
    if (effectiveSchoolId) {
      refetchParticipantSchools();
      refetchSchoolsGeneralQuota();
      refetchSchoolsProductQuota();
      refetchSchoolsPurchases();
      refetchSportsQuota();
    }
  }, [
    effectiveSchoolId,
    refetchParticipantSchools,
    refetchSchoolsGeneralQuota,
    refetchSchoolsProductQuota,
    refetchSchoolsPurchases,
    refetchSportsQuota,
  ]);

  useEffect(() => {
    if (competitionUsers && sportSchools) {
      const newCounter: string[][] = sportSchools.map((school) => {
        const participants = competitionUsers.filter(
          (user) => user.user.school_id === school.school_id,
        );
        return [school.school_id, participants.length.toString()];
      });
      setSchoolCompetitionUsersCounter(newCounter);
    }
  }, [competitionUsers, sportSchools]);

  if (!schoolId && userSchoolId) {
    router.push(`/admin/validation?school_id=${userSchoolId}`);
    return null;
  }

  if (schoolId && !canAccessSchool) {
    router.push(`/admin/validation?school_id=${userSchoolId}`);
    return null;
  }

  if (!effectiveSchoolId) {
    return (
      <div className="flex items-center justify-center h-full mt-10">
        <p className="text-gray-500">Aucune école associée à votre compte</p>
      </div>
    );
  }

  const school = sportSchools?.find((s) => s.school_id === effectiveSchoolId);

  const totalParticipants = participantTableData.length;
  const totalValidated = participantTableData.filter(
    (p) => p.isValidated,
  ).length;

  const totalTeams = new Set(
    participantTableData.map((p) => p.teamId).filter(Boolean),
  ).size;

  return (
    <div className="space-y-6">
      {/* Header with title and action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Validation</h1>
          <p className="text-muted-foreground">
            Gestion des participants de{" "}
            {school ? formatSchoolName(school.school.name) : "l'école"}
          </p>
        </div>
      </div>

      {isAdmin() ? (
        sportSchools &&
        sportSchools.length > 0 && (
          <Tabs
            value={effectiveSchoolId}
            onValueChange={(value) => {
              router.push(`/admin/validation?school_id=${value}`);
            }}
            className="w-full"
          >
            <TabsList className="flex w-full overflow-x-auto justify-start mb-6 h-auto gap-2">
              {sportSchools.map((school) => {
                const participants = schoolParticipants?.filter(
                  (p) => p.school_id === school.school_id,
                );

                return (
                  <TabsTrigger
                    key={school.school_id}
                    value={school.school_id}
                    className="relative"
                  >
                    <div className="flex items-center gap-2">
                      {formatSchoolName(school.school.name)}
                      <Badge variant={"secondary"} className="text-xs">
                        {schoolCompetitionUsersCounter.find(
                          (s) => s[0] === school.school_id,
                        )
                          ? schoolCompetitionUsersCounter.find(
                              (s) => s[0] === school.school_id,
                            )![1]
                          : participants
                            ? participants.length
                            : 0}
                      </Badge>
                    </div>
                  </TabsTrigger>
                );
              })}
            </TabsList>
            <TabsContent key={effectiveSchoolId} value={effectiveSchoolId!}>
              <ValidationTab
                participantTableData={participantTableData}
                onValidate={onValidate}
                onInvalidate={onInvalidate}
                onDelete={onDelete}
                onCancel={onCancel}
                isValidateLoading={isValidateLoading}
                isInvalidateLoading={isInvalidateLoading}
                isDeleteLoading={isDeleteLoading}
                school={school}
                totalParticipants={totalParticipants}
                totalValidated={totalValidated}
                totalTeams={totalTeams}
                sportsQuota={sportsQuota || []}
                schoolsProductQuota={schoolsProductQuota}
                schoolsGeneralQuota={schoolsGeneralQuota}
                schoolsProductQuotaUsed={schoolsGeneralQuotaUsed}
                products={products}
                validatedCounts={validatedCounts}
              />
            </TabsContent>
          </Tabs>
        )
      ) : (
        <ValidationTab
          participantTableData={participantTableData}
          onValidate={onValidate}
          onInvalidate={onInvalidate}
          onDelete={onDelete}
          onCancel={onCancel}
          isValidateLoading={isValidateLoading}
          isInvalidateLoading={isInvalidateLoading}
          isDeleteLoading={isDeleteLoading}
          school={school}
          totalParticipants={totalParticipants}
          totalValidated={totalValidated}
          totalTeams={totalTeams}
          sportsQuota={sportsQuota || []}
          schoolsProductQuota={schoolsProductQuota}
          schoolsGeneralQuota={schoolsGeneralQuota}
          schoolsProductQuotaUsed={schoolsGeneralQuotaUsed}
          products={products}
          validatedCounts={validatedCounts}
        />
      )}
    </div>
  );
};

export default Dashboard;
