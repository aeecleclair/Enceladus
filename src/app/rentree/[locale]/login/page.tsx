"use client";

import MyECLButton from "@/components/common/MyEclButton";
import { TextSeparator } from "@/components/siarnaq/custom/TextSeparator";
import { useYear } from "@/hooks/siarnaq/useYear";
import { useRouter } from "@/i18n/navigation";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Login = () => {
  const t = useTranslations("siarnaq");
  const router = useRouter();
  const { year } = useYear();
  const possiblePromos = Array.from({ length: 5 }).map((_, index) => {
    return (year - index).toString();
  });

  const [selectedPromo, setSelectedPromo] = useState<string | undefined>(
    undefined,
  );
  return (
    <div className="flex [&>div]:w-full h-[--custom-vh] bg-muted/40">
      <Card className="rounded-xl border bg-card text-muted-foreground shadow max-w-175 m-auto">
        <CardHeader>
          <CardTitle>{t("login.title", { year: year.toString() })}</CardTitle>
          <CardDescription className="flex flex-col gap-2">
            <span>{t("login.description")}</span>
            <span>
              {t("login.contact")}{" "}
              <a href="mailto://edouard.backman@etu.ec-lyon.fr">
                edouard.backman@etu.ec-lyon.fr
              </a>
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
          <span className="m-auto">{t("login.selectPromotion")}</span>
          <span className=" text-center text-sm text-orange-500">
            {t("login.usePersonalEmail")}
          </span>
          <div key="curriculum" className="h-full gap-4 flex flex-col">
            <Select
              value={selectedPromo?.toString()}
              onValueChange={setSelectedPromo}
            >
              <SelectTrigger className="w-full m-auto">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {possiblePromos.map((promo) => (
                    <SelectItem key={promo} value={promo.toString()}>
                      {t("login.promotion", { year: promo })}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {selectedPromo && (
            <Button
              variant="outline"
              size="lg"
              className="w-full m-auto"
              onClick={() => {
                let redirectUri =
                  process.env.NEXT_PUBLIC_BACKEND_URL + "/calypsso/register";
                if (selectedPromo === possiblePromos[0].toString()) {
                  redirectUri += "?external=true";
                }
                router.push(redirectUri);
              }}
            >
              {t("login.register")}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
