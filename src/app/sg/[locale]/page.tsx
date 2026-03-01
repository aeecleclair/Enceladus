"use client";
import { useMeUser } from "@/hooks/useMeUser";

export default function Page() {
  const { user } = useMeUser();
  console.log(user);
  return (
    <main className="flex min-h-[calc(--custom-vh-(--spacing(32)))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      <div>
        <p>
          Bienvenue {user?.firstname} {user?.name} sur SG !
        </p>
        <p>En construction</p>
      </div>
    </main>
  );
}
