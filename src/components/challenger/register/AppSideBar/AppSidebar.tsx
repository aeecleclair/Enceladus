"use client";
import Image from "next/image";
import * as React from "react";
import { Command, LogIn } from "lucide-react";
import { Timeline, TimelineItemLabel } from "@/src/components/custom/Timeline";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../ui/sidebar";
import { NavUser } from "../../custom/NavUser";
import { TimelineStep } from "./TimelineStep";
import { RegisterState } from "@/src/infra/registerState";
import { Logo } from "../../custom/Logo";

export function AppSidebar({
  state,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  state: RegisterState;
}) {
  const numberOfItem = state.allHeaderSubtitles.length;
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <Logo />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Challenger</span>
                  <span className="truncate text-xs">Inscription</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <div className="p-4">
          <Timeline>
            <TimelineItemLabel>Suivis inscription</TimelineItemLabel>
            {state.allHeaderSubtitles.map((subtitle, index) => (
              <TimelineStep
                key={index}
                label={subtitle}
                description={state.stepDone > index ? "Terminé" : "En cours"}
                isCompleted={state.stepDone > index}
              />
            ))}
            <TimelineItemLabel>Confirmation</TimelineItemLabel>
            <TimelineStep
              label="Validation du BDS"
              description={
                state.stepDone > numberOfItem ? "Terminé" : "En cours"
              }
              isCompleted={state.stepDone > numberOfItem}
            />
            <TimelineItemLabel>Paiement</TimelineItemLabel>
            <TimelineStep
              label="Validation de paiement"
              description={
                state.stepDone > numberOfItem + 1 ? "Terminé" : "En cours"
              }
              isCompleted={state.stepDone > numberOfItem + 1}
            />
          </Timeline>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
