"use client";

import { useAuth } from "../../hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useCodeVerifierStore } from "@/src/stores/codeVerifier";
import { useEffect, useState } from "react";
import { LoadingButton } from "../custom/LoadingButton";

const Login = () => {
  const { token, isTokenExpired, login, isLoading, getTokenFromRequest } =
    useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const { codeVerifier } = useCodeVerifierStore();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (
      code &&
      typeof window !== "undefined" &&
      !isLoading &&
      codeVerifier !== undefined &&
      !isLoggingIn
    ) {
      setIsLoggingIn(true);
      login(code, () => {
        router.replace(redirect);
      });
    }
  }, [code, isLoading, codeVerifier, login, router, isLoggingIn, redirect]);

  if (token !== null && !isTokenExpired()) {
    router.replace(redirect);
  }

  function connectMyECL(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    getTokenFromRequest();
  }

  return (
    <LoadingButton
      isLoading={isLoading}
      onClick={connectMyECL}
      className="w-full py-6 text-lg"
    >
      Se connecter avec MyECL
    </LoadingButton>
  );
};

export default Login;
