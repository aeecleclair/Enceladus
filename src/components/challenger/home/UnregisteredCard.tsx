"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

interface UnregisteredCardProps {
  edition: {
    year: number;
    name: string;
  };
}

export const UnregisteredCard = ({ edition }: UnregisteredCardProps) => {
  const router = useRouter();

  return (
    <div className="px-4 justify-center items-center flex h-full flex-col space-y-4">
      <h2 className="text-xl font-semibold">
        Édition {edition.year} - {edition.name}
      </h2>
      <div className="text-center space-y-3">
        <h3 className="text-lg font-medium text-orange-600">
          Inscription non commencée
        </h3>

        <p className="text-sm text-muted-foreground">
          Vous n&apos;avez pas commencé votre inscription.
        </p>

        <p className="text-sm text-muted-foreground">
          Si vous souhaitez participer, veuillez vous inscrire.
        </p>

        <Button onClick={() => router.push("/register")} className="mt-4">
          Commencer mon inscription
        </Button>
      </div>
    </div>
  );
};
