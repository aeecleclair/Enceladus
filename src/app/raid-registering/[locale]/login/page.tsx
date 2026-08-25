"use client";

import { useAuth } from "@/app/authContext";
import MyECLButton from "@/components/common/MyEclButton";
import { useRouter } from "@/i18n/navigation";

import { useSearchParams } from "next/navigation";
import * as React from "react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Login = () => {
  const router = useRouter();
  const { token, isTokenExpired } = useAuth();
  const searchParams = useSearchParams();
  const hasCode = searchParams.get("code") !== null;

  useEffect(() => {
    // Only bounce to home if the user is actually authenticated. A stale
    // (expired) token in the cookie must not trigger a redirect — otherwise
    // we ping-pong with the permission guard.
    if (token && !isTokenExpired() && !hasCode) {
      router.replace("/");
    }
  }, [token, isTokenExpired, hasCode, router]);

  return (
    <div className="flex min-h-screen items-center bg-linear-to-b from-muted/25 via-background to-muted/10 px-4 py-8 sm:px-5">
      <Card className="mx-auto w-full max-w-175 rounded-xl border border-border/70 bg-card text-card-foreground shadow-sm">
        <CardHeader>
          <CardTitle>Se connecter</CardTitle>
          <CardDescription>
            Connectez-vous avec votre compte MyECL pour accéder à
            l&apos;inscription Raid.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <MyECLButton subdomain="inscription-raid" />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-row justify-between">
          <Button
            variant="link"
            onClick={() => {
              const redirectUri =
                process.env.NEXT_PUBLIC_BACKEND_URL +
                "/calypsso/register?external=true";
              window.location.href = redirectUri;
            }}
          >
            Créer un compte
          </Button>
          <Button
            variant="link"
            onClick={() => {
              const redirectUri =
                process.env.NEXT_PUBLIC_BACKEND_URL + "/calypsso/recover/";
              window.location.href = redirectUri;
            }}
          >
            Mot de passe oublié ?
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
