import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CardLayoutProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const CardLayout = ({
  label,
  description,
  children,
  className,
}: CardLayoutProps) => {
  return (
    <Card className={cn("border-border/70 shadow-sm", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </CardTitle>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
};
