"use client";

import { ChartView } from "./ChartView";

import { RaidTeamPreview } from "@/api";
import { Switch } from "@/components//ui/switch";
import { getStats } from "@/lib/raid/statsUtils";

import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StatsViewProps {
  teams?: RaidTeamPreview[];
  isLoading: boolean;
}

export const StatsView = ({ teams }: StatsViewProps) => {
  const [seeAll, setSeeAll] = useState(false);
  const {
    difficultyData,
    meetingPlaceData,
    bikeSizeData,
    tShirtSizeData,
    situationData,
  } = getStats(seeAll, teams);
  return (
    <Card className="border-border/70 bg-card/95 shadow-sm">
      <CardHeader className="flex flex-col items-center justify-between">
        <div className="flex flex-row justify-between w-full">
          <CardTitle>Statistiques</CardTitle>
          <Switch checked={seeAll} onCheckedChange={setSeeAll} />
        </div>
        <div className="ml-auto">
          <CardDescription>
            {seeAll ? "Toutes les équipes" : "Equipes validées"}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="difficulty">
          <TabsList className="mb-6 grid w-full grid-cols-5 bg-muted/40">
            <TabsTrigger value="difficulty">Parcours</TabsTrigger>
            <TabsTrigger value="meetingPlace">Départ</TabsTrigger>
            <TabsTrigger value="bikeSize">VTT</TabsTrigger>
            <TabsTrigger value="tShirtSize">T-Shirt</TabsTrigger>
            <TabsTrigger value="situation">Situation</TabsTrigger>
          </TabsList>
          <TabsContent value="difficulty">
            <ChartView data={difficultyData} />
          </TabsContent>
          <TabsContent value="meetingPlace">
            <ChartView data={meetingPlaceData} />
          </TabsContent>
          <TabsContent value="bikeSize">
            <ChartView data={bikeSizeData} />
          </TabsContent>
          <TabsContent value="tShirtSize">
            <ChartView data={tShirtSizeData} />
          </TabsContent>
          <TabsContent value="situation">
            <ChartView data={situationData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
