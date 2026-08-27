"use client";

import { useAuth } from "@/app/authContext";
import { UserShell } from "@/components/raid/home/UserShell";
import { IdentityForm } from "@/components/raid/register/IdentityForm";
import { useMeUser } from "@/hooks/useMeUser";
import { useRouter } from "@/i18n/navigation";
import { formatDate } from "@/lib/dateFormat";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Pencil, UserRound, X } from "lucide-react";

const ProfilePage = () => {
  const { isTokenQueried, token } = useAuth();
  const { user } = useMeUser();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isTokenQueried && token === null) {
      router.replace("/login");
    }
  }, [isTokenQueried, token, router]);

  return (
    <UserShell>
      <main className="mx-auto w-full space-y-5 py-4 sm:py-5">
        <section className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur-sm sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/15 text-teal-700 dark:text-teal-400">
              <UserRound className="h-7 w-7" />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                Mon profil
              </h1>
              <p className="text-sm text-muted-foreground">
                Informations liées a votre compte MyECL et a votre inscription.
              </p>
            </div>
          </div>
        </section>

        <Card className="overflow-hidden border-border/70 bg-card shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between border-b border-border/60 bg-muted/20">
            <div>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Consultez vos informations, puis modifiez-les si necessaire.
              </CardDescription>
            </div>
            <Button
              size="sm"
              variant={isEditing ? "ghost" : "outline"}
              onClick={() => setIsEditing((v) => !v)}
            >
              {isEditing ? (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Annuler
                </>
              ) : (
                <>
                  <Pencil className="mr-2 h-4 w-4" />
                  Modifier
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {isEditing ? (
              <IdentityForm
                onComplete={() => setIsEditing(false)}
                submitLabel="Enregistrer"
              />
            ) : (
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-lg border border-border/60 bg-muted/10 px-4 py-3">
                  <p className="text-xs text-muted-foreground">Prénom</p>
                  <p className="font-medium">{user?.firstname ?? "—"}</p>
                </div>
                <div className="rounded-lg border border-border/60 bg-muted/10 px-4 py-3">
                  <p className="text-xs text-muted-foreground">Nom</p>
                  <p className="font-medium">{user?.name ?? "—"}</p>
                </div>
                <div className="rounded-lg border border-border/60 bg-muted/10 px-4 py-3 sm:col-span-2">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium">{user?.email ?? "—"}</p>
                </div>
                <div className="rounded-lg border border-border/60 bg-muted/10 px-4 py-3">
                  <p className="text-xs text-muted-foreground">Téléphone</p>
                  <p className="font-medium">{user?.phone ?? "—"}</p>
                </div>
                <div className="rounded-lg border border-border/60 bg-muted/10 px-4 py-3">
                  <p className="text-xs text-muted-foreground">
                    Date de naissance
                  </p>
                  <p className="font-medium">
                    {user?.birthday ? formatDate(user.birthday) : "—"}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </UserShell>
  );
};

export default ProfilePage;
