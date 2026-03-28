"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

interface IncompleteRegistrationCardProps {
  edition: {
    year: number;
    name: string;
  };
  meCompetition?: {
    validated?: boolean;
  };
  hasPaid: boolean | undefined;
}

export const IncompleteRegistrationCard = ({
  edition,
  meCompetition,
  hasPaid,
}: IncompleteRegistrationCardProps) => {
  const router = useRouter();

  return (
    <div className="px-4 justify-center items-center flex h-full flex-col space-y-4">
      <h2 className="text-xl font-semibold">
        Édition {edition.year} - {edition.name}
      </h2>
      <div className="text-center space-y-3">
        <h3 className="text-lg font-medium text-orange-600">
          Inscription incomplète
        </h3>

        {!meCompetition?.validated && !hasPaid && (
          <p className="text-sm text-muted-foreground">
            Votre inscription n&apos;est pas encore validée et le paiement
            n&apos;a pas été effectué.
          </p>
        )}
        {!meCompetition?.validated && !!hasPaid && (
          <p className="text-sm text-muted-foreground">
            Votre paiement a été reçu mais votre inscription n&apos;est pas
            encore validée.
          </p>
        )}
        {meCompetition?.validated && !hasPaid && (
          <p className="text-sm text-muted-foreground">
            Votre inscription est validée mais le paiement n&apos;a pas encore
            été effectué.
          </p>
        )}

        <p className="text-sm text-muted-foreground">
          Veuillez finaliser votre inscription pour accéder à toutes les
          fonctionnalités.
        </p>

        <Button onClick={() => router.push("/register")} className="mt-4">
          Finaliser mon inscription
        </Button>
      </div>
    </div>
  );
};
