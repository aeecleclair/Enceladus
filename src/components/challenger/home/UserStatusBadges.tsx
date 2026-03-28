import { useVolunteer } from "@/src/hooks/useVolunteer";

interface UserStatusBadgesProps {
  meCompetition: {
    is_athlete?: boolean;
    is_pompom?: boolean;
    is_fanfare?: boolean;
    is_cameraman?: boolean;
  };
}

export const UserStatusBadges = ({ meCompetition }: UserStatusBadgesProps) => {
  const { volunteer } = useVolunteer();
  const isVolunteer = volunteer && volunteer.length > 0;

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold">Statut(s)</h2>
      <div className="flex flex-wrap gap-2">
        {meCompetition.is_athlete && (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            Athlète
          </span>
        )}
        {isVolunteer && (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            Bénévole
          </span>
        )}
        {meCompetition.is_pompom && (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-pink-100 text-pink-800 rounded-full">
            Pom-pom
          </span>
        )}
        {meCompetition.is_fanfare && (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
            Fanfare
          </span>
        )}
        {meCompetition.is_cameraman && (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
            Caméraman
          </span>
        )}
        {!meCompetition.is_athlete &&
          !isVolunteer &&
          !meCompetition.is_pompom &&
          !meCompetition.is_fanfare &&
          !meCompetition.is_cameraman && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
              Supporter
            </span>
          )}
      </div>
    </div>
  );
};
