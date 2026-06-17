import { columns } from "./Columns";
import { DataTable } from "./DataTable";

import { useTickets } from "@/hooks/sg/useTickets";

interface TicketSearchProps {
  eventId?: string | null;
}

export const TicketSearch = ({ eventId }: TicketSearchProps) => {
  const { tickets } = useTickets(eventId);

  return (
    <div className="flex items-center justify-center p-6 min-w-96">
      <DataTable columns={columns} data={tickets} />
    </div>
  );
};
