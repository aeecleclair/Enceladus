import { PageIndicator } from "@/components/siarnaq/custom/PageIndicator";
import { useOnlineSellers } from "@/hooks/siarnaq/useOnlineSellers";
import { useYear } from "@/hooks/siarnaq/useYear";
import { Link } from "@/i18n/navigation";

import { useTranslations } from "next-intl";
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
        <div>{t("info.cdrOnsiteDescription")}</div>
        <div className="font-bold">{t("info.cdrOnsiteMandatoryWarning")}</div>

        <div className="pl-10">
          <a
            href="mailto://bde@ec-lyon.fr"
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
        <div>
          {t.rich("info.cautionDescription", {
            payable: (chunks) => <span className="italic">{chunks}</span>,
          })}
        </div>
        <div>{t("info.cautionInstructions", { year: yearString })}</div>
        <div>
          {t.rich("info.cautionInstructions2", {
            link: () => (
              <Link
                href="https://v2.swik.link/1XxsMUZ"
                target="_blank"
                className="font-bold text-sky-600 underline visited:text-purple-600"
              >
                https://v2.swik.link/1XxsMUZ
              </Link>
            ),
          })}
        </div>
        <div>
          {t.rich("info.cautionMandatory", {
            mandatory: (chunks) => <span className="font-bold">{chunks}</span>,
          })}
        </div>

        {/* */}
        <h3 className="text-lg font-semibold flex flex-row items-center pt-5">
          <HiOutlineNewspaper className="h-4 w-4 mr-2" />
          {t("info.facebookTitle")}
        </h3>
        <div>{t("info.facebook", { year: yearString })}</div>
        <div className="pl-10">
          {/* TODO: provide a clean link like https://www.facebook.com/groups/admis2024 */}
          <a
            href="https://www.facebook.com/share/g/1FQ72yPVjk"
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
        {/* */}
        {/* I'm so sorry Jho...
        <h3 className="text-lg font-semibold flex flex-row items-center pt-5">
          <HiOutlineUserGroup className="h-4 w-4 mr-2" />
          {t("info.elementTitle")}
        </h3>
        <div>{t("info.element")}</div>
        <div className="pl-10">
          <ol className="list-decimal">
            <li>
              <a
                href="https://element.io/download"
                className="font-medium hover:underline underline-offset-4 flex flex-row items-center"
              >
                <HiOutlineLink className="h-4 w-4 mr-1" />
                {t("info.elementStep1")}
              </a>
            </li>
            <li>{t("info.elementStep2")}</li>
            <li>
              {t("info.elementStep3")} <code>myecl.fr</code>
            </li>
            <li>{t("info.elementStep4")}</li>
          </ol>
        </div>
        */}
      </CardContent>

      <CardFooter className="px-6 py-4">
        <PageIndicator currentSellerId="info" onlineSellers={onlineSellers} />
      </CardFooter>
    </Card>
  );
};
