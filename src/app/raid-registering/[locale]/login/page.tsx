"use client";

import MyECLButton from "@/components/common/MyEclButton";

import { useRouter } from "next/navigation";
import * as React from "react";

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
  return (
    <div className="flex [&>div]:w-full h-screen">
      <Card className="rounded-xl border bg-card text-card-foreground shadow max-w-175 m-auto">
        <CardHeader>
          <CardTitle>Se connecter</CardTitle>
          <CardDescription>
            Si vous possédez déjà un compte MyECL, vous pouvez vous connecter
            avec.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <MyECLButton subdomain="raid-registering" />
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
              router.push(redirectUri);
            }}
          >
            Créer un compte
          </Button>
          <Button
            variant="link"
            onClick={() => {
              const redirectUri =
                process.env.NEXT_PUBLIC_BACKEND_URL + "/calypsso/recover/";
              router.push(redirectUri);
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
