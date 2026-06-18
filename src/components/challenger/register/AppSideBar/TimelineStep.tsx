import {
  TimelineConnector,
  TimelineContent,
  TimelineContentDescription,
  TimelineContentLabel,
  TimelineDot,
  TimelineItem,
} from "../../custom/Timeline";

import { CheckIcon } from "lucide-react";

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
          {isCompleted && <CheckIcon className="p-0.5" />}
        </TimelineDot>
      </TimelineConnector>
      <TimelineContent>
        <TimelineContentLabel>{label}</TimelineContentLabel>
        <TimelineContentDescription>{description}</TimelineContentDescription>
      </TimelineContent>
    </TimelineItem>
  );
};
