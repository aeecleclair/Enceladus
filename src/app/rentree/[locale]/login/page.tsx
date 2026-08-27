"use client";

import MyECLButton from "@/components/common/MyEclButton";
import { TextSeparator } from "@/components/siarnaq/custom/TextSeparator";
import { useYear } from "@/hooks/siarnaq/useYear";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Login = () => {
  const t = useTranslations("siarnaq");
  const { year } = useYear();

  return (
    <div className="flex [&>div]:w-full h-[--custom-vh] bg-muted/40">
      <Card className="rounded-xl border bg-card text-muted-foreground shadow max-w-175 m-auto">
        <CardHeader>
          <CardTitle>{t("login.title", { year: year.toString() })}</CardTitle>
          <CardDescription className="flex flex-col gap-2">
            <span>{t("login.description")}</span>
            <span>
              {t("login.contact")} <br />
              <a href="mailto:bde@ec-lyon.fr">bde@ec-lyon.fr</a>
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <span className="m-auto">{t("login.alreadyHaveMyECLAccount")}</span>
          <form>
            <div className="grid w-full items-center gap-4">
              <MyECLButton subdomain="rentree" />
            </div>
          </form>
          <TextSeparator text={t("login.or")} />
          <span className=" text-center text-sm text-orange-500">
            {t("login.usePersonalEmail")}
          </span>

          <Button
            variant="outline"
            size="lg"
            className="w-full m-auto"
            onClick={() => {
              window.open(
                process.env.NEXT_PUBLIC_BACKEND_URL + "/calypsso/register",
              );
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
