import { CircularProgressBar } from "./CircularProgressBar";

import { Badge } from "@/components/ui/badge";

interface ProgressBadgeProps {
  progress: number;
  total: number;
}

export const ProgressBadge = ({ progress, total }: ProgressBadgeProps) => {
  return (
    <div className="flex items-center w-30">
      <Badge variant="outline">
        <CircularProgressBar value={(progress / total) * 100} />
        <span className="ml-2">
          {progress} / {total} {"validés"}
        </span>
      </Badge>
    </div>
  );
};
