import { ParticipantComplete, ParticipantInfo, Sport } from "@/api";
import { RegisteringFormValues } from "@/forms/challenger/registering";

interface SportStepDependencies {
  sports?: Sport[];
  meParticipant?: ParticipantComplete;
  withdrawParticipant: (
    sportId: string,
    callback: () => void,
  ) => Promise<boolean>;
  createParticipant: (
    body: ParticipantInfo,
    sportId: string,
    callback: () => void | Promise<void>,
  ) => unknown;
  uploadDocument: (
    file: Blob,
    sportId: string,
    callback: () => void,
  ) => Promise<void>;
}

/**
 * Registers the user for the chosen sport, then deposits the medical
 * certificate. The certificate belongs to the participant, so it can only be
 * sent once the participant exists — and the step must not be validated
 * before the upload is over, otherwise leaving the page cancels it.
 */
export const submitSportStep = async (
  values: RegisteringFormValues,
  callback: () => void,
  {
    sports,
    meParticipant,
    withdrawParticipant,
    createParticipant,
    uploadDocument,
  }: SportStepDependencies,
) => {
  const sportId = values.sport?.id;
  const sport = sports?.find((s) => s.id === sportId);
  if (!sportId || !sport) {
    return;
  }

  const body: ParticipantInfo = {
    license: values.sport?.license_number ?? null,
    team_id: sport.team_size === 1 ? null : (values.sport?.team_id ?? null),
    substitute: values.sport?.substitute,
  };

  // The previous registration has to be actually removed before creating the
  // new one, otherwise the API rejects the second registration.
  if (meParticipant !== undefined) {
    const isWithdrawn = await withdrawParticipant(
      meParticipant.sport_id,
      () => {},
    );
    if (!isWithdrawn) {
      return;
    }
  }

  await createParticipant(body, sportId, async () => {
    const certificateFile = values.sport?.certificateFile as
      | Blob
      | undefined
      | null;
    if (!certificateFile) {
      callback();
      return;
    }
    await uploadDocument(certificateFile, sportId, callback);
  });
};
