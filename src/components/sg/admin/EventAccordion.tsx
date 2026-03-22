import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
// import { AddingVariantCard } from "./AddingVariantCard";
// import { ProductAccordionOptions } from "./ProductAccordionOptions";
// import { VariantCardWithOptions } from "./VariantCardWithOptions";

import { useMemberships } from "@/hooks/siarnaq/useMemberships";
import { useUserMemberships } from "@/hooks/siarnaq/useUserMemberships";
import { useUserPurchases } from "@/hooks/siarnaq/useUserPurchases";
import { useSizeStore } from "@/stores/siarnaq/SizeStore";
import { useTranslation } from "@/translations/utils";

import { useTranslations } from "next-intl";
import { HiOutlineCheckBadge } from "react-icons/hi2";

import { Badge } from "@/components/ui/badge";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { EventSimple, AppModulesTicketingSchemasTicketingEventComplete as TicketingEventComplete} from "@/api";
import { useCdrUser } from "@/hooks/siarnaq/useCdrUser";
import { EventAccordionOptions } from "./EventAccordionOptions";

interface EventAccordionProps {
  event: EventSimple;
  canAdd?: boolean;
  canEdit?: boolean;
  canRemove?: boolean;
  canDisable?: boolean;
  sellerId: string;
  userId: string;
  showDescription?: boolean;
  refreshProduct: () => void;
  isSelectable?: boolean;
  isAdmin?: boolean;
}

export const EventAccordion = ({
  event,
  canAdd,
  canEdit,
  canRemove,
  canDisable,
  sellerId,
  userId,
  showDescription = false,
  refreshProduct,
  isSelectable = false,
  isAdmin = false,
}: EventAccordionProps) => {
  const t = useTranslations("sg");
  const { selectTranslation } = useTranslation();
  const { size } = useSizeStore();
  const numberOfCard = Math.round(size / 20);
  
  const { purchases: userPurchases } = useUserPurchases(userId);
  const purchasedVariantIds = userPurchases.map(
    (purchase) => purchase.product_variant_id
  );
  const { user } = useCdrUser(userId);
  const { userMemberships } = useUserMemberships(userId);
  const { memberships } = useMemberships();
  const variantToDisplay = isAdmin
    ? event.variants
    : event.variants
        ?.filter(
          (variant) =>
            variant.enabled || purchasedVariantIds.includes(variant.id)
        )
        .filter((variant) =>
          variant.allowed_curriculum
            ?.map((curriculum) => curriculum.id)
            ?.includes(user?.curriculum?.id ?? "")
        );
  const purchasedProductIds = userPurchases.map(
    (purchase) => purchase.product.id
  );
  const missingConstraintProducts = event.product_constraints?.filter(
    (constraint) => !purchasedProductIds.includes(constraint.id)
  );
  const isMissingConstraint =
    missingConstraintProducts && missingConstraintProducts?.length > 0;
  const isOneVariantTaken = event.variants?.some((variant) =>
    purchasedVariantIds.includes(variant.id)
  );

  const takenMembership = userMemberships?.find(
    (userMembership) =>
      event.related_membership?.id ===
        userMembership.association_membership_id &&
      new Date(userMembership.end_date).getTime() - new Date().getTime() >
        1000 * 60 * 60 * 24 * 30
  );
  const takenMembershipName = memberships.find(
    (membership) => membership.id === takenMembership?.association_membership_id
  )?.name;

  const isMembershipAlreadyTaken = takenMembership !== undefined;

  const isConstraintMembershipTaken = userMemberships?.some((userMembership) =>
    event.product_constraints?.some(
      (constraint) =>
        constraint?.related_membership?.id ===
        userMembership.association_membership_id
    )
  );

  const displayWarning =
    isMissingConstraint &&
    isOneVariantTaken &&
    !isMembershipAlreadyTaken &&
    !isConstraintMembershipTaken;

  return (
    (isAdmin || (variantToDisplay?.length ?? 0) > 0) && (
      <AccordionItem value={event.id}>
        <ContextMenu>
          <ContextMenuTrigger>
            <AccordionTrigger>
              <div className="flex flex-row items-center gap-2">
                <div className="flex flex-col items-start justify-between">
                  <h3 className="text-lg font-semibold flex flex-row">
                    {event.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {format(new Date(event.open_date), "dd/MM/yyyy", { locale: fr })}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
          </ContextMenuTrigger>
          <EventAccordionOptions
            product={event}
            sellerId={sellerId}
            refreshProduct={refreshProduct}
            canEdit={true}
            canRemove={true}
          />
        </ContextMenu>
        <AccordionContent>
          {/* Take care to export all grid-cols-n
        Can't find a better way to do it for now */}
          <div className="hidden grid-cols-5" />
          <div className="hidden grid-cols-4" />
          <div className="hidden grid-cols-3" />
          <div className="hidden grid-cols-2" />
          <div className="hidden grid-cols-1" />
          {displayWarning && (
            <p className="text-red-500 font-semibold mb-2">
              {t("productAccordion.mustBuy", {
                products:
                  missingConstraintProducts
                    ?.map((product) =>
                      selectTranslation(product.name_en, product.name_fr)
                    )
                    .join(", ") ?? "",
              })}
            </p>
          )}
          {event.related_membership && isMembershipAlreadyTaken && (
            <p className="text-green-700 my-2 font-semibold">
              {t("productAccordion.membershipAlreadyTaken", {
                membership: takenMembershipName ?? "",
                date: format(
                  new Date(takenMembership?.end_date),
                  "dd/MM/yyyy",
                  { locale: fr }
                ),
              })}
            </p>
          )}
          <div
            className={`grid ${
              showDescription ? "grid-row" : "grid-cols-" + numberOfCard
            } gap-4`}
          >
            {variantToDisplay && (
              <>
                {canAdd && (
                  <AddingVariantCard
                    sellerId={sellerId}
                    productId={event.id}
                    refreshProduct={refreshProduct}
                    isInterestProduct={!event.needs_validation}
                    isMembershipProduct={
                      event.related_membership != undefined
                    }
                  />
                )}
                {variantToDisplay.map((variant) => (
                  <VariantCardWithOptions
                    key={variant.id}
                    variant={variant}
                    product={event}
                    sellerId={sellerId}
                    userId={userId}
                    canEdit={canEdit}
                    canRemove={canRemove}
                    canDisable={canDisable}
                    showDescription={showDescription}
                    refreshProduct={refreshProduct}
                    isSelectable={
                      isSelectable &&
                      (((variant.allowed_curriculum
                        ?.map((curriculum) => curriculum.id)
                        .includes(user?.curriculum?.id ?? "") ||
                        false) &&
                        !isMembershipAlreadyTaken) ||
                        purchasedVariantIds.includes(variant.id))
                    }
                    isAdmin={isAdmin}
                    displayWarning={
                      displayWarning ||
                      (!variant.enabled &&
                        purchasedVariantIds.includes(variant.id))
                    }
                    isInterestProduct={!event.needs_validation}
                    isMembershipProduct={
                      event.related_membership != undefined
                    }
                  />
                ))}
              </>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    )
  );
};
