import { PageIndicator } from "@/components/siarnaq/custom/PageIndicator";
import { useOnlineSellers } from "@/hooks/siarnaq/useOnlineSellers";
import { useYear } from "@/hooks/siarnaq/useYear";

import { useTranslations } from "next-intl";
import { HiOutlineInformationCircle } from "react-icons/hi";
import {
  HiOutlineBanknotes,
  HiOutlineCalendar,
  HiOutlineDevicePhoneMobile,
  HiOutlineEnvelope,
  HiOutlineLink,
  HiOutlineNewspaper,
} from "react-icons/hi2";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const InfoPanel = () => {
  const t = useTranslations("siarnaq");
  const { onlineSellers } = useOnlineSellers();
  const { year } = useYear();
  const yearString = year.toString();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("info.information")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <h3 className="text-lg font-semibold flex flex-row items-center pt-5">
          <HiOutlineCalendar className="h-4 w-4 mr-2" />
          {t("info.cdrOnsiteTitle")}
        </h3>
        <div>
          {t.rich("info.cdrOnsiteSubtitle", {
            mandatory: (chunks) => <span className="font-bold">{chunks}</span>,
          })}
        </div>
        <div>
          {t.rich("info.cdrOnsiteMandatoryWarning", {
            mandatory: (chunks) => <span className="font-bold">{chunks}</span>,
          })}
        </div>

        <div className="pl-10">
          <a
            href="mailto:bde@ec-lyon.fr"
            className="font-medium hover:underline underline-offset-4 flex flex-row items-center"
          >
            <HiOutlineEnvelope className="h-4 w-4 mr-2" />
            bde@ec-lyon.fr
          </a>
        </div>

        {/* */}
        <h3 className="text-lg font-semibold flex flex-row items-center pt-5">
          <HiOutlineBanknotes className="h-4 w-4 mr-2" />
          {t("info.cautionTitle")}
        </h3>
        <div>{t("info.cautionDescription")}</div>
        <div className="pl-10">
          {/* TODO: provide a clean link like https://www.facebook.com/groups/admis2026 */}
          <a
            href="https://v2.swik.link/ni1hTTw"
            className="font-medium hover:underline underline-offset-4 flex flex-row items-center"
          >
            <HiOutlineLink className="h-4 w-4 mr-2" />
            {t("info.cautionLink")}
          </a>
        </div>
        <div>
          {t.rich("info.cautionMandatory", {
            mandatory: (chunks) => <span className="font-bold">{chunks}</span>,
          })}
        </div>

        {/* */}
        <h3 className="text-lg font-semibold flex flex-row items-center pt-5">
          <HiOutlineInformationCircle className="h-4 w-4 mr-2" />
          {t("info.welcomeGuide")}
        </h3>
        <div>{t("info.welcomeGuideDescription", { year: yearString })}</div>
        <div className="pl-10">
          <a
            href="https://drive.google.com/file/d/1rPuM15aQQXyTjwsUkN46kyI_X4twQE-N/view?usp=sharing"
            className="font-medium hover:underline underline-offset-4 flex flex-row items-center"
          >
            <HiOutlineLink className="h-4 w-4 mr-2" />
            {t("info.welcomeEmail", { year: yearString })}
          </a>
        </div>
        <div className="pl-10">
          <a
            href="https://drive.google.com/file/d/1-Vg4xRVZl9IvJWvH89eQ1iTBv5b-ZBIn/view?usp=sharing"
            className="font-medium hover:underline underline-offset-4 flex flex-row items-center"
          >
            <HiOutlineLink className="h-4 w-4 mr-2" />
            {t("info.welcomeGuideFR", { year: yearString })}
          </a>
        </div>
        <div className="pl-10">
          <a
            href="https://drive.google.com/file/d/1xVGqq4ht5pbRNzb7MUkKztUTSg8nNPZS/view?usp=sharing"
            className="font-medium hover:underline underline-offset-4 flex flex-row items-center"
          >
            <HiOutlineLink className="h-4 w-4 mr-2" />
            {t("info.welcomeGuideEN", { year: yearString })}
          </a>
        </div>
        {/* */}
        <h3 className="text-lg font-semibold flex flex-row items-center pt-5">
          <HiOutlineNewspaper className="h-4 w-4 mr-2" />
          {t("info.facebookTitle")}
        </h3>
        <div>{t("info.facebook", { year: yearString })}</div>
        <div className="pl-10">
          {/* TODO: provide a clean link like https://www.facebook.com/groups/admis2026 */}
          <a
            href="https://www.facebook.com/groups/959246073797752/"
            className="font-medium hover:underline underline-offset-4 flex flex-row items-center"
          >
            <HiOutlineLink className="h-4 w-4 mr-2" />
            {t("info.group", { year: yearString })}
          </a>
        </div>
        {/* */}
        <h3 className="text-lg font-semibold flex flex-row items-center pt-5">
          <HiOutlineDevicePhoneMobile className="h-4 w-4 mr-2" />
          {t("info.myECLTitle")}
        </h3>
        <div>{t("info.myECL")}</div>
        <div className="pl-10">
          <a
            href="https://apps.apple.com/fr/app/myecl/id6444443430"
            className="font-medium hover:underline underline-offset-4 flex flex-row items-center"
          >
            <HiOutlineLink className="h-4 w-4 mr-2" />
            {t("info.downloadMyECLiOS")}
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=fr.myecl.titan"
            className="font-medium hover:underline underline-offset-4 flex flex-row items-center"
          >
            <HiOutlineLink className="h-4 w-4 mr-2" />
            {t("info.downloadMyECLAndroid")}
          </a>
        </div>
      </CardContent>

      <CardFooter className="px-6 py-4">
        <PageIndicator currentSellerId="info" onlineSellers={onlineSellers} />
      </CardFooter>
    </Card>
  );
};
