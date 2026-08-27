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
  const { sportSchools } = useSportSchools();
  const { user: currentUser } = useMeUser();
  const { updateLicense, isUpdateLoading } = useLicense();

  const [schoolParticipantsCounter, setSchoolParticipantsCounter] = useState<
    string[][]
  >([]);

  const searchParam = useSearchParams();
  const schoolId = searchParam.get("school_id");

  if (!schoolId) {
    router.push("/admin/license?school_id=" + currentUser?.school_id || "");
  }

  const userSchoolId = currentUser?.school_id;

  const effectiveSchoolId = schoolId || userSchoolId;

  const { schoolParticipants, refetchParticipantSchools } =
    useSchoolParticipants({
      schoolId: effectiveSchoolId || null,
    });

  useEffect(() => {
    if (effectiveSchoolId) {
      refetchParticipantSchools();
    }
  }, [effectiveSchoolId, refetchParticipantSchools]);

  useEffect(() => {
    if (schoolParticipants) {
      if (schoolParticipantsCounter.find((s) => s[0] === effectiveSchoolId)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSchoolParticipantsCounter((prev) => {
          const newCounter = prev.map((s) =>
            s[0] === effectiveSchoolId
              ? [s[0], schoolParticipants.length.toString()]
              : s,
          );
          return newCounter;
        });
      } else {
        setSchoolParticipantsCounter((prev) => [
          ...prev,
          [effectiveSchoolId!, schoolParticipants.length.toString()],
        ]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolParticipants]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolParticipants]);

  const onValidate = (userId: string, sportId: string, isValid: boolean) => {
    updateLicense(sportId, userId, isValid, () => {
      refetchParticipantSchools();
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with title and action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">License</h1>
          <p className="text-muted-foreground">Gestion des licenses</p>
        </div>
      </div>

      {sportSchools && sportSchools.length > 0 ? (
        <Tabs defaultValue={sportSchools[0].school_id} className="w-full">
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
                  onClick={() => {
                    router.push(`/admin/license?school_id=${school.school_id}`);
                  }}
                >
                  <div className="flex items-center gap-2">
                    {formatSchoolName(school.school.name)}
                    <Badge variant={"secondary"} className="text-xs">
                      {schoolParticipantsCounter.find(
                        (s) => s[0] === school.school_id,
                      )
                        ? schoolParticipantsCounter.find(
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
