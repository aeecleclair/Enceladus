import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
} from "@/components/ui/sidebar"
import { AdminSidebarFooter } from "./AdminSidebarFooter";
import { Timeline, TimelineItemLabel } from "./Timeline";
import { TimelineStep } from "./TimelineStep";
import AddEventState from "@/infra/AddEventState";

export function EditEventSidebar({
    state,
    ...props
    }: React.ComponentProps<typeof Sidebar> & {
    state?: AddEventState;
    }) {
    return (
        <Sidebar className="pl-4" variant="inset">
            <SidebarContent>
                <SidebarGroup />
                    <Timeline>
                        <TimelineItemLabel>Modification d'un SG</TimelineItemLabel>
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
            <AdminSidebarFooter />
        </Sidebar>
    )
}
