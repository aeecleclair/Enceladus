import { Card, CardContent } from "@/components/ui/card";
import { CarouselItem } from "@/components/ui/carousel";

interface CardTemplateProps {
  children?: React.ReactNode;
}

export const CardTemplate = ({ children }: CardTemplateProps) => {
  return (
    <CarouselItem>
      <div className="grid gap-4 h-full p-4">{children}</div>
    </CarouselItem>
  );
};
