import { CdrUser, UserMembershipComplete } from "@/api";
import { useMemberships } from "@/hooks/siarnaq/useMemberships";
import { useUserMemberships } from "@/hooks/siarnaq/useUserMemberships";

import { useTranslations } from "next-intl";

interface MembershipRecapProps {
  user: CdrUser;
}

export const MembershipRecap = ({ user }: MembershipRecapProps) => {
  const { userMemberships } = useUserMemberships(user.id);
  const { memberships } = useMemberships();
  const t = useTranslations("siarnaq");

  if (userMemberships.length === 0) return;
  return (
    <>
      <span className="font-semibold text-muted-foreground">
        {t("recapPanel.memberships")} :
      </span>
      <div className="flew flew-col gap-2">
        {userMemberships?.map((membership: UserMembershipComplete) => {
          const membershipName = memberships.find(
            (association_membership) =>
              association_membership.id ===
              membership.association_membership_id,
          )?.name;
          const membershipStartDate = new Date(membership.start_date);
          const membershipEndDate = new Date(membership.end_date);
          const isMembershipActive =
            new Date().getTime() < membershipEndDate.getTime();
          return (
            <div
              key={membership.id}
              className={isMembershipActive ? "text-green-400" : "text-red-400"}
            >
              <span>{membershipName} : </span>
              <span className="font-light">
                {membershipStartDate.toLocaleDateString()}
                {" - "}
                {membershipEndDate.toLocaleDateString()}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
};
