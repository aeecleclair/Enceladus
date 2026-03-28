import { useRouter } from "next/navigation";

interface EditionWaitingCardProps {
  edition: {
    year: number;
    name: string;
    start_date: string;
    inscription_enabled: boolean;
  };
  isSchoolInscriptionEnabled: boolean;
}

export const EditionWaitingCard = ({
  edition,
  isSchoolInscriptionEnabled,
}: EditionWaitingCardProps) => {
  const router = useRouter();
  return (
    <div className="px-4 justify-center items-center flex h-full flex-col space-y-4">
      <h2 className="text-xl font-semibold">
        Édition {edition.year} - {edition.name}
      </h2>
      {!edition.inscription_enabled ? (
        <h3 className="text-lg font-medium text-orange-600">
          Les inscriptions ne sont pas encore ouvertes pour cette édition.
        </h3>
      ) : !isSchoolInscriptionEnabled ? (
        <h3 className="text-lg font-medium text-orange-600">
          Les inscriptions ne sont pas encore ouvertes pour votre école.
        </h3>
      ) : null}
      <p className="text-sm text-muted-foreground text-center">
        L&apos;édition débutera le{" "}
        {new Date(edition.start_date).toLocaleDateString("fr-FR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
      <p className="text-sm text-muted-foreground">Veuillez patienter.</p>
    </div>
  );
};
