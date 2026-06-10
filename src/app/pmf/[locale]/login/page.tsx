"use client";

import MyECLButton from "@/components/common/MyEclButton";
import { useRouter } from "@/i18n/navigation";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export default function Login() {
  const t = useTranslations("pmf");
  const router = useRouter();
  return (
    <div>
      {t("login.title")}
      <MyECLButton subdomain="pmf" />
      <span>{t("login.register")}</span>
      <Button
        variant="outline"
        size="lg"
        className="w-full m-auto"
        onClick={() => {
          const redirectUri =
            process.env.NEXT_PUBLIC_BACKEND_URL + "/calypsso/register";
          router.push(redirectUri);
        }}
      >
        {t("login.student")}
      </Button>
      <Button
        variant="outline"
        size="lg"
        className="w-full m-auto"
        onClick={() => {
          const redirectUri =
            process.env.NEXT_PUBLIC_BACKEND_URL +
            "/calypsso/register?external=true";
          router.push(redirectUri);
        }}
      >
        {t("login.alumni")}
      </Button>
    </div>
  );
}
