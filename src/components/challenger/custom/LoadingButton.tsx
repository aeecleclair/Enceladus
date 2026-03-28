import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

interface LoadingButtonProps {
  variant?:
    | "link"
    | "outline"
    | "default"
    | "destructive"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  isLoading: boolean;
  type?: "submit" | "button" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
}

export const LoadingButton = ({
  isLoading,
  type,
  onClick,
  children,
  className,
  disabled,
  variant = "default",
  size = "default",
}: LoadingButtonProps) => {
  return (
    <Button
      variant={variant}
      type={type}
      onClick={onClick}
      className={className}
      disabled={isLoading || disabled}
      size={size}
    >
      {isLoading ? <ReloadIcon className="h-4 w-4 animate-spin" /> : children}
    </Button>
  );
};
