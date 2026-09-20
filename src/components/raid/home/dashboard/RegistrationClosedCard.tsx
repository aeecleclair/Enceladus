import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Lock } from "lucide-react";
import { useTranslations } from "next-intl";

export const RegistrationClosedCard = () => {
  const t = useTranslations("raid.home.dashboard.registrationClosed");
  return (
    <Card className="mx-auto w-full max-w-3xl border-border/70 bg-card/90 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Lock className="h-5 w-5" />
          </div>
          <CardTitle>{t("cardTitle")}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{t("cardDescription")}</p>
      </CardContent>
    </Card>
  );
};
