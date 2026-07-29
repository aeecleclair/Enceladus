import { CdrUser, postCdrUsersUserIdCurriculumsCurriculumId } from "@/api";
import { LoadingButton } from "@/components/common/LoadingButton";
import { useCurriculums } from "@/hooks/siarnaq/useCurriculums";
import { useOnlineSellers } from "@/hooks/siarnaq/useOnlineSellers";
import { useRouter } from "@/i18n/navigation";

import { useTranslations } from "next-intl";
import { useState } from "react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

import { AnimatePresence, motion } from "framer-motion";

interface IntroCarouselItemsProps {
  user: CdrUser;
  refetch: () => void;
}

export const IntroCarouselItems = ({
  user,
  refetch,
}: IntroCarouselItemsProps) => {
  const [carouselApi, setCarouselApi] = React.useState<CarouselApi | null>(
    null,
  );
  const { toast } = useToast();
  const t = useTranslations("siarnaq");
  const { curriculums } = useCurriculums();
  const { onlineSellers } = useOnlineSellers();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const buttonLabels = [t("introCarouselItem.begin"), t("introPanel.validate")];
  const [selectedCurriculum, setSelectedCurriculum] = useState<
    string | undefined
  >(user.curriculum?.id);

  const canGoNext =
    page === 0 ||
    (page === 1 &&
      selectedCurriculum &&
      selectedCurriculum !== user.curriculum?.id);
  const content: React.ReactNode[] = [
    <div key="intro" className="flex flex-col gap-2">
      <span>{t("introCarouselItem.welcome")}</span>
      <span className="text-justify">{t("introCarouselItem.description")}</span>
      <span>
        {t("introCarouselItem.contact")}
        <a
          href="mailto://edouard.backman@etu.ec-lyon.fr"
          className="whitespace-pre"
        >
          edouard.backman@etu.ec-lyon.fr
        </a>
      </span>
    </div>,
    <div key="curriculum" className="h-full gap-4 flex flex-col">
      <span>{t("introCarouselItem.selectCurriculum")}</span>
      <Select value={selectedCurriculum} onValueChange={setSelectedCurriculum}>
        <SelectTrigger className="w-75 m-auto">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {curriculums.map((curriculum) => (
              <SelectItem key={curriculum.id} value={curriculum.id}>
                <Badge variant="secondary">{curriculum.name}</Badge>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>,
  ];

  async function setCurriculum() {
    setIsLoading(true);
    if (!selectedCurriculum) {
      setIsLoading(false);
      return;
    }
    const { error } = await postCdrUsersUserIdCurriculumsCurriculumId({
      path: {
        user_id: user!.id,
        curriculum_id: selectedCurriculum,
      },
    });
    if (error) {
      toast({
        description: error.detail,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    refetch();
    setIsLoading(false);
  }

  async function onNextStep() {
    if (canGoNext) {
      if (page === 1) {
        await setCurriculum();
        const firstSeller =
          onlineSellers.length > 0 ? onlineSellers[0] : undefined;
        if (firstSeller) {
          router.push(`?sellerId=${firstSeller.id}`);
        }
      }
      if (page === 0 && !user.curriculum?.id) {
        setPage(page + 1);
        carouselApi?.scrollNext();
      } else {
        const firstSeller =
          onlineSellers.length > 0 ? onlineSellers[0] : undefined;
        if (firstSeller) {
          router.push(`?sellerId=${firstSeller.id}`);
        }
      }
    }
  }

  return (
    <Carousel setApi={setCarouselApi}>
      <CarouselContent>
        {content.map((item, index) => (
          <CarouselItem key={index}>{item}</CarouselItem>
        ))}
      </CarouselContent>
      <div className="pb-6 pt-10 flex justify-center">
        <LoadingButton
          size="lg"
          className="w-40"
          onClick={onNextStep}
          isLoading={isLoading}
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {buttonLabels[page]}
            </motion.div>
          </AnimatePresence>
        </LoadingButton>
      </div>
    </Carousel>
  );
};
