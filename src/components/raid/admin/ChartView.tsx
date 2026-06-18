"use client";

import { useTheme } from "next-themes";
import { Bar, BarChart, Cell, ResponsiveContainer } from "recharts";

interface CardViewProps {
  data: {
    value: number;
    label: string;
  }[];
}

const theme = {
  cssVars: {
    light: {
      primary: "240 5.9% 10%",
    },
    dark: {
      primary: "0 0% 98%",
    },
  },
};

export const ChartView = ({ data }: CardViewProps) => {
  const { theme: mode } = useTheme();

  return (
    <div>
      <ResponsiveContainer className="min-h-40 md:min-h-80">
        <BarChart data={data}>
          <Bar
            dataKey="value"
            radius={[10, 10, 0, 0]}
            style={{
              fill: `hsl(${
                theme?.cssVars[mode === "dark" ? "dark" : "light"].primary
              })`,
              opacity: 1,
            }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index + 1}`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex flex-row mt-1">
        {data.map((entry, index) => (
          <div className="flex flex-col w-full" key={`cell-${index + 1}`}>
            <span className="text-center font-semibold">{entry.label}</span>
            <span className="text-sm text-muted-foreground w-full text-center">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
