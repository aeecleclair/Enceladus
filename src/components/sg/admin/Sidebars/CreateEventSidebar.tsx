import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useTranslations } from "next-intl";
import { Timeline, TimelineItemLabel,  } from "./Timeline";
import { TimelineStep } from "./TimelineStep";
import  AddEventState  from "@/infra/AddEventState";

export function CreateEventSidebar({
    state,
    ...props
    }: React.ComponentProps<typeof Sidebar> & {
    state?: AddEventState;
    }) {
    
    const t = useTranslations("sg.admin.sidebar");
    return (
        <Sidebar className="pl-4" variant="inset">
            {/* <SidebarHeader >
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{t("title")}</span>
                                <span className="truncate text-xs">{t("subtitle")}</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </ SidebarHeader > */}
            <SidebarContent>
                <SidebarGroup />
                    <Timeline>
                        <TimelineItemLabel>Création d'un SG</TimelineItemLabel>
                            {state?.allHeaderSubtitles.map((subtitle, index) => (
                            <TimelineStep
                                key={index}
                                label={subtitle}
                                description={(state.stepDone ?? 0) > index ? "Terminé" : "En cours"}
                                isCompleted={(state.stepDone ?? 0) > index}
                            />
                            ))}
                        <TimelineItemLabel>Confirmation</TimelineItemLabel>
                    </Timeline>
                <SidebarGroup />
            </SidebarContent>
        <SidebarFooter />
        </Sidebar>
    )
}