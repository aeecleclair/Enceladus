import { SecurityFile } from "@/api";
import { ParticipantInfo } from "@/components/raid/custom/ParticipantInfo";
import { TextSeparator } from "@/components/raid/custom/TextSeparator";

import { useTranslations } from "next-intl";

interface SecurityFileDialogViewProps {
  file: SecurityFile;
}

export const SecurityFileDialogView = ({
  file,
}: SecurityFileDialogViewProps) => {
  const t = useTranslations("raid.team.securityFile");

  function getAsthma() {
    return (
      <>
        <ParticipantInfo label={t("asthma")} value={file.asthma} />
        {file.asthma && (
          <>
            <ParticipantInfo
              label={t("intensiveCare")}
              value={file.intensive_care_unit}
            />
            {file.intensive_care_unit && (
              <>
                <ParticipantInfo
                  label={t("intensiveCareDate")}
                  value={file.intensive_care_unit_when}
                />
              </>
            )}
          </>
        )}
      </>
    );
  }

  if (!file.consent_given) {
    return (
      <div className="flex flex-col justify-between h-full w-full">
        <p className="text-muted-foreground">{t("noConsentMessage")}</p>
        <div className="my-4 items-center">
          <TextSeparator text={t("emergencyPerson")} />
        </div>
        <ParticipantInfo
          label={t("emergencyFirstname")}
          value={file.emergency_person_firstname}
        />
        <ParticipantInfo
          label={t("emergencyName")}
          value={file.emergency_person_name}
        />
        <ParticipantInfo
          label={t("emergencyPhone")}
          value={file.emergency_person_phone}
          isPhone
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between h-full w-full">
      <ParticipantInfo label={t("allergy")} value={file.allergy} />
      {getAsthma()}
      <ParticipantInfo
        label={t("ongoingTreatment")}
        value={file.ongoing_treatment}
      />
      <ParticipantInfo label={t("sicknesses")} value={file.sicknesses} />
      <ParticipantInfo
        label={t("hospitalization")}
        value={file.hospitalization}
      />
      <ParticipantInfo
        label={t("surgicalOperation")}
        value={file.surgical_operation}
      />
      <ParticipantInfo label={t("trauma")} value={file.trauma} />
      <ParticipantInfo label={t("family")} value={file.family} />

      <div className="my-4 items-center">
        <TextSeparator text={t("emergencyPerson")} />
      </div>
      <ParticipantInfo
        label={t("emergencyFirstname")}
        value={file.emergency_person_firstname}
      />
      <ParticipantInfo
        label={t("emergencyName")}
        value={file.emergency_person_name}
      />
      <ParticipantInfo
        label={t("emergencyPhone")}
        value={file.emergency_person_phone}
        isPhone
      />
    </div>
  );
};
