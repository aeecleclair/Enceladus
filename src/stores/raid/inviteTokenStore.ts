import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface InviteTokenStore {
  inviteToken?: string;
  setInviteToken: (inviteToken?: string) => void;
  resetInviteToken: () => void;
}

export const useInviteTokenStore = create<InviteTokenStore>()(
  devtools(
    persist(
      (set) => ({
        inviteToken: undefined,
        setInviteToken: (inviteToken?: string) => {
          set({ inviteToken });
        },
        resetInviteToken: () => {
          set({ inviteToken: undefined });
        },
      }),
      {
        name: "raid-invite-token-storage",
      },
    ),
  ),
);
