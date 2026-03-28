import { Badge } from "../ui/badge";
import { CircularProgressBar } from "./CircularProgressBar";

interface ProgressBadgeProps {
  progress: number;
  total: number;
}

export const ProgressBadge = ({ progress, total }: ProgressBadgeProps) => {
  return (
    <div className="flex items-center w-[120px]">
      <Badge variant="outline">
        <CircularProgressBar value={(progress / total) * 100} />
        <span className="ml-2">
          {progress} / {total} {"validés"}
        </span>
      </Badge>
    </div>
  );
};
