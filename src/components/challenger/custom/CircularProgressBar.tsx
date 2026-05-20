import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface CircularProgressBarProps {
  value: number;
}

export const CircularProgressBar = ({ value }: CircularProgressBarProps) => {
  return (
    <div className="h-3 w-3">
      <CircularProgressbar
        value={value}
        strokeWidth={15}
        styles={{
          root: {},
          path: {
            stroke: `black`,
            strokeLinecap: "round",
          },
          trail: {},
          text: {},
          background: {},
        }}
      />
    </div>
  );
};
