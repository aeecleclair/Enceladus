"use client";

import MyECLButton from "@/components/common/MyEclButton";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export default function Login() {
  const t = useTranslations("pmf");
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center mt-20 gap-6">
      <h1 className="text-3xl font-bold text-center">{t("login.title")}</h1>
      <MyECLButton subdomain="pmf" />
      <p className="text-sm text-gray-300">{t("login.register")}</p>
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            const redirectUri =
              process.env.NEXT_PUBLIC_BACKEND_URL + "/calypsso/register";
            router.push(redirectUri);
          }}
        >
          {t("login.login")}
        </Button>
      </div>
    </div>
  );
}
