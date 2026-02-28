"use client";
import { useMeUser } from "@/hooks/useMeUser";

export default function Page() {
  const { user } = useMeUser();
  console.log(user);
  return (
    <div>
      <p>
        Bienvenue {user?.firstname} {user?.name} sur PMF !
      </p>
      <p>En construction</p>
    </div>
  );
}
