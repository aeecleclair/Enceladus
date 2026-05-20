import { CaptainsExport } from "./CaptainsExport";
import { GlobalExport } from "./GlobalExport";
import { SchoolQuotasExport } from "./SchoolQuotasExport";
import { SchoolUsersExport } from "./SchoolUsersExport";
import { SportParticipantsExport } from "./SportParticipantsExport";
import { SportQuotasExport } from "./SportQuotasExport";

export const ExportsPage = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <GlobalExport />
        <SchoolUsersExport />
        <SchoolQuotasExport />
        <SportQuotasExport />
        <SportParticipantsExport />
        <CaptainsExport />
      </div>
    </div>
  );
};
