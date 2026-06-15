import * as React from "react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { type LucideIcon } from "lucide-react";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild size="sm">
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

// <Collapsible key={item.school_id} asChild defaultOpen={item.isActive}>
//   <SidebarMenuItem>
//     <SidebarMenuButton asChild tooltip={item.title}>
//       <a href={item.url}>
//         <item.icon />
//         <span>{item.title}</span>
//       </a>
//     </SidebarMenuButton>
//     {item.items?.length ? (
//       <>
//         <CollapsibleTrigger asChild>
//           <SidebarMenuAction className="data-[state=open]:rotate-90">
//             <ChevronRight />
//             <span className="sr-only">Toggle</span>
//           </SidebarMenuAction>
//         </CollapsibleTrigger>
//         <CollapsibleContent>
//           <SidebarMenuSub>
//             {item.items?.map((subItem) => (
//               <SidebarMenuSubItem key={subItem.title}>
//                 <SidebarMenuSubButton asChild>
//                   <a href={subItem.url}>
//                     <span>{subItem.title}</span>
//                   </a>
//                 </SidebarMenuSubButton>
//               </SidebarMenuSubItem>
//             ))}
//           </SidebarMenuSub>
//         </CollapsibleContent>
//       </>
//     ) : null}
//   </SidebarMenuItem>
// </Collapsible>
