"use client";

import { TextSeparator } from "@/components/siarnaq/custom/TextSeparator";
import { useRouter } from "@/i18n/navigation";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MyECLButton from "@/components/common/MyEclButton";

const Login = () => {
  const t = useTranslations("sg");
  const router = useRouter();

  return (
    <div className="flex [&>div]:w-full h-[--custom-vh] bg-muted/40">
      <Card className="rounded-xl border bg-card text-muted-foreground shadow max-w-[700px] m-auto">
        <CardHeader>
          <CardTitle>{t("login.title")}</CardTitle>
          <CardDescription className="flex flex-col gap-2">
            <span>{t("login.description")}</span>
            <span>
              {t("login.contact")}{" "}
              <a href="mailto://eclair@myecl.fr">eclair@myecl.fr</a>
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <span className="m-auto">{t("login.alreadyHaveMyECLAccount")}</span>
          <form>
            <div className="grid w-full items-center gap-4">
              <MyECLButton subdomain="sg" />
            </div>
          </form>
          <TextSeparator text={t("login.or")} />
          <span className="m-auto">{t("login.createAccount")}</span>
            <Button
              variant="outline"
              size="lg"
              className="w-full m-auto"
              onClick={() => {
                let redirectUri =
                  process.env.NEXT_PUBLIC_BACKEND_URL + "/calypsso/register";
                router.push(redirectUri);
              }}
            >
              {t("login.register")}
            </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
