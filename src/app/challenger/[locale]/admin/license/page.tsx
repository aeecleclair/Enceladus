"use client";

import { ParticipantDataTable } from "@/components/challenger/admin/license/ParticipantDataTable";
import { useLicense } from "@/hooks/challenger/useLicense";
import { useSchoolParticipants } from "@/hooks/challenger/useSchoolParticipants";
import { useSportSchools } from "@/hooks/challenger/useSportSchools";
import { useSports } from "@/hooks/challenger/useSports";
import { useMeUser } from "@/hooks/useMeUser";
import { useRouter } from "@/i18n/navigation";
import { formatSchoolName } from "@/lib/challenger/schoolFormatting";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const router = useRouter();
  const { sports } = useSports();
  const { activeSportSchools: sportSchools } = useSportSchools();
  const { user: currentUser } = useMeUser();
  const { updateLicense, isUpdateLoading } = useLicense();

  const searchParam = useSearchParams();
  const schoolId = searchParam.get("school_id");
  const userSchoolId = currentUser?.school_id;

  const effectiveSchoolId = schoolId || userSchoolId || null;

  const [participantsCount, setParticipantsCount] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    if (!schoolId && userSchoolId) {
      router.replace(`/admin/license?school_id=${userSchoolId}`);
    }
  }, [schoolId, userSchoolId, router]);

  const { schoolParticipants, refetchParticipantSchools } =
    useSchoolParticipants({ schoolId: effectiveSchoolId });

  useEffect(() => {
    if (!effectiveSchoolId || !schoolParticipants) return;

    const isDataForCurrentSchool = schoolParticipants.every(
      (p) => p.school_id === effectiveSchoolId,
    );
    if (!isDataForCurrentSchool) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticipantsCount((prev) => ({
      ...prev,
      [effectiveSchoolId]: schoolParticipants.length,
    }));
  }, [schoolParticipants, effectiveSchoolId]);

  const participants = useMemo(() => {
    return schoolParticipants?.map((participant) => ({
      userId: participant.user_id,
      sportId: participant.sport_id,
      sportName:
        sports?.find((s) => s.id === participant.sport_id)?.name || "Aucun",
      fullName:
        participant.user.user.firstname + " " + participant.user.user.name,
      email: participant.user.user.email,
      license: participant.license || undefined,
      certificateFileId: participant.certificate_file_id || undefined,
      isValidated: participant.is_license_valid,
    }));
  }, [schoolParticipants, sports]);

  const onValidate = (userId: string, sportId: string, isValid: boolean) => {
    updateLicense(sportId, userId, isValid, () => {
      refetchParticipantSchools();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">License</h1>
          <p className="text-muted-foreground">Gestion des licenses</p>
        </div>
      </div>

      {sportSchools && sportSchools.length > 0 && effectiveSchoolId ? (
        <Tabs
          value={effectiveSchoolId}
          className="w-full"
          onValueChange={(value) =>
            router.push(`/admin/license?school_id=${value}`)
          }
        >
          <TabsList className="flex w-full overflow-x-auto justify-start mb-6 h-auto gap-2">
            {sportSchools.map((school) => (
              <TabsTrigger
                key={school.school_id}
                value={school.school_id}
                className="relative"
              >
                <div className="flex items-center gap-2">
                  {formatSchoolName(school.school.name)}
                  <Badge variant="secondary" className="text-xs">
                    {participantsCount[school.school_id] ?? 0}
                  </Badge>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={effectiveSchoolId}>
            {participants ? (
              <div className="overflow-y-auto">
                <ParticipantDataTable
                  data={participants}
                  onValidateParticipant={onValidate}
                  isLoading={isUpdateLoading}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full mt-10">
                <p className="text-gray-500">
                  Aucun participant trouvé pour cette école
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="flex items-center justify-center h-full mt-10">
          <p className="text-gray-500">
            Aucun participant trouvé pour cette école
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
