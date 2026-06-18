import { IntroCarouselItems } from "./IntroCarouselItems";

import { useCdrUser } from "@/hooks/siarnaq/useCdrUser";
import { useTokenStore } from "@/stores/token";

import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel } from "@/components/ui/carousel";

export const IntroPanel = () => {
  const t = useTranslations("siarnaq");
  const { userId } = useTokenStore();
  const { user, refetch } = useCdrUser(userId);
  return (
    <Card className="max-md:w-auto">
      <CardHeader>
        <CardTitle>{t("introPanel.presentation")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Carousel
          opts={{
            watchDrag: false,
          }}
        >
          {user && <IntroCarouselItems user={user} refetch={refetch} />}
        </Carousel>
      </CardContent>
    </Card>
  );
};
