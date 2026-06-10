"use client";

import { LoadingButton } from "./LoadingButton";

import { useRouter } from "@/i18n/navigation";
import { useCodeVerifierStore } from "@/stores/codeVerifier";
import { useTokenStore } from "@/stores/token";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import * as auth from "oauth4webapi";

const MyECLButton = ({ subdomain }: { subdomain: string }) => {
  const t = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { setCodeVerifier, codeVerifier } = useCodeVerifierStore();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const issuerUrl = new URL(
    process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://hyperion.myecl.fr",
  );
  const { token, setToken, setRefreshToken } = useTokenStore();

  async function getIssuer() {
    return auth
      .discoveryRequest(issuerUrl, { algorithm: "oauth2" })
      .then((response) => auth.processDiscoveryResponse(issuerUrl, response));
  }
  let redirectUri = "";
  if (process.env.NEXT_PUBLIC_FRONTEND_URL) {
    const splitURL = process.env.NEXT_PUBLIC_FRONTEND_URL.split("://");
    redirectUri = `${splitURL[0]}://${subdomain}.${splitURL[1]}/${locale}/login`;
  } else {
    redirectUri = "";
  }
  const client: auth.Client = {
    client_id: process.env.NEXT_PUBLIC_CLIENT_ID ?? "",
    token_endpoint_auth_method: "none",
  };

  if (code && !isLoading && typeof window !== "undefined" && codeVerifier) {
    login(new URL(window.location.href));
    router.push("/login");
  }

  async function login(url: URL) {
    setIsLoading(true);
    const hyperionIssuer = await getIssuer();
    const params = auth.validateAuthResponse(
      hyperionIssuer,
      client,
      url,
      auth.skipStateCheck,
    );
    if (auth.isOAuth2Error(params)) {
      throw new Error(); // Handle OAuth 2.0 redirect error
    }

    const response = await auth.authorizationCodeGrantRequest(
      hyperionIssuer,
      client,
      params,
      redirectUri,
      codeVerifier ?? "",
    );

    const result = await auth.processAuthorizationCodeOAuth2Response(
      hyperionIssuer,
      client,
      response,
    );
    if (auth.isOAuth2Error(result)) {
      setIsLoading(false);
      throw new Error(); // Handle OAuth 2.0 response body error
    }
    setToken(result.access_token);
    setRefreshToken(result.refresh_token ?? null);
    setIsLoading(false);
  }

  async function openSSO() {
    const hyperionIssuer = await getIssuer();

    const generatedCodeVerifier = auth.generateRandomCodeVerifier();
    setCodeVerifier(generatedCodeVerifier);
    const codeChallenge = await auth.calculatePKCECodeChallenge(
      generatedCodeVerifier,
    );
    const codeChallengeMethod = "S256";

    const authorizationUrl = new URL(hyperionIssuer.authorization_endpoint!);
    authorizationUrl.searchParams.set("client_id", client.client_id);
    authorizationUrl.searchParams.set("redirect_uri", redirectUri);
    authorizationUrl.searchParams.set("response_type", "code");
    authorizationUrl.searchParams.set("scope", "API");
    authorizationUrl.searchParams.set("code_challenge", codeChallenge);
    authorizationUrl.searchParams.set(
      "code_challenge_method",
      codeChallengeMethod,
    );
    if (
      hyperionIssuer.code_challenge_methods_supported?.includes("S256") !== true
    ) {
      const state = auth.generateRandomState();
      authorizationUrl.searchParams.set("state", state);
    }
    router.push(authorizationUrl.href);
  }

  if (token !== null) {
    router.push("/");
  }

  return (
    <LoadingButton
      isLoading={isLoading}
      onClick={(e) => {
        e.preventDefault();
        openSSO();
      }}
    >
      {t("MyECLButton.authenticate")}
    </LoadingButton>
  );
};

export default MyECLButton;
