import { useTranslations } from "next-intl";


export default function TestPage() {
    const t = useTranslations("pmf");
    return <div>{t("TestPage.Sample")}</div>;
}