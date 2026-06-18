import { JSX } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface TeamInfo {
  title: string;
  value: string;
  description: string;
  unit?: JSX.Element;
}

interface TeamInfoCardProps {
  info: TeamInfo;
  isLoaded: boolean;
}

export const TeamInfoCard = ({ info, isLoaded }: TeamInfoCardProps) => {
  return (
    <Card key={info.title}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {isLoaded ? (
            <span>{info.title}</span>
          ) : (
            <Skeleton className="w-24 h-5" />
          )}
        </CardTitle>
        {info.unit &&
          (isLoaded ? (
            info.unit
          ) : (
            <Skeleton className="w-4 h-4 text-muted-foreground" />
          ))}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isLoaded ? info.value : <Skeleton className="w-37.5 h-6" />}
        </div>

        {isLoaded ? (
          <p className="text-xs text-muted-foreground">{info.description}</p>
        ) : (
          <Skeleton className="w-30 h-4 mt-1" />
        )}
      </CardContent>
    </Card>
  );
};
