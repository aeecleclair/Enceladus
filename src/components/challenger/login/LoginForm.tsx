import { cn } from "@/lib/utils";
import MyECLButton from "./MyECLButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();

  return (
    <form className={cn("flex flex-col gap-12", className)} {...props}>
      <div className="flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold mb-6">Se connecter</h1>
        <p className="text-muted-foreground text-balance text-lg max-w-md">
          Si vous possédez déjà un compte MyECL, vous pouvez vous connecter
          avec.
        </p>
      </div>

      <div className="grid gap-8">
        <MyECLButton />
      </div>

      <div className="text-center text-base">
        Vous n&apos;avez pas de compte ?{" "}
        <button
          onClick={() => {
            let redirectUri =
              process.env.NEXT_PUBLIC_BACKEND_URL +
              "/calypsso/register?external=true";

            router.push(redirectUri);
          }}
          className="underline underline-offset-4 font-medium text-primary hover:text-primary/80"
        >
          Créer un compte
        </button>
      </div>
    </form>
  );
}
