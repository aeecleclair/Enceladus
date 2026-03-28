import { CheckIcon } from "lucide-react";
import {
  TimelineItem,
  TimelineConnector,
  TimelineDot,
  TimelineContent,
  TimelineContentLabel,
  TimelineContentDescription,
} from "../../custom/Timeline";

export const TimelineStep = ({
  label,
  description,
  isCompleted,
}: {
  label: string;
  description?: string;
  isCompleted?: boolean;
}) => {
  return (
    <TimelineItem>
      <TimelineConnector>
        <TimelineDot variant={isCompleted ? "outline" : "default"}>
          {isCompleted && <CheckIcon className="p-[2px]" />}
        </TimelineDot>
      </TimelineConnector>
      <TimelineContent>
        <TimelineContentLabel>{label}</TimelineContentLabel>
        <TimelineContentDescription>{description}</TimelineContentDescription>
      </TimelineContent>
    </TimelineItem>
  );
};
