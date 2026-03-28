import { CarouselItem } from "../../ui/carousel";
import { Card, CardContent } from "../../ui/card";

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
