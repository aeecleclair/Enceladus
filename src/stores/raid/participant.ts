import { RaidParticipant } from "@/api";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface ParticipantStore {
  participant?: RaidParticipant;
  setParticipant: (participant?: RaidParticipant) => void;
  resetParticipant: () => void;
}

export const useParticipantStore = create<ParticipantStore>()(
  devtools(
    persist(
      (set) => ({
        participant: undefined,
        setParticipant: (participant?: RaidParticipant) => {
          set({ participant: participant });
        },
        resetParticipant: () => {
          set({ participant: undefined });
        },
      }),
      {
        name: "raid-participant-storage",
      },
    ),
  ),
);
