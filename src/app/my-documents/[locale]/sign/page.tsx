"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

import { EmbedSignDocument } from "@documenso/embed-react";

type Status = "loading" | "ready" | "completed" | "error";

const SignDocumentPage = () => {
  const t = useTranslations("myDocuments");
  const searchParams = useSearchParams();
  const signingToken = searchParams.get("signingToken");
  const fullName = decodeURIComponent(searchParams.get("fullName") || "");
  const email = decodeURIComponent(searchParams.get("email") || "");

  const [status, setStatus] = useState<Status>("loading");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const readyTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (!signingToken) return;

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const attachLoadListener = (iframe: HTMLIFrameElement) => {
      iframe.addEventListener("load", () => {
        readyTimeoutRef.current = setTimeout(() => {
          setStatus((s) => (s === "loading" ? "error" : s));
        }, 3000);
      });
    };

    const existing = wrapper.querySelector("iframe");
    if (existing) {
      attachLoadListener(existing as HTMLIFrameElement);
      return;
    }
    const observer = new MutationObserver(() => {
      const found = wrapper.querySelector("iframe");
      if (found) {
        observer.disconnect();
        attachLoadListener(found as HTMLIFrameElement);
      }
    });

    observer.observe(wrapper, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      if (readyTimeoutRef.current) clearTimeout(readyTimeoutRef.current);
    };
  }, [signingToken]);

  if (!signingToken) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <p className="text-lg font-semibold">
            {t("sign.missingSigningToken")}
          </p>
          <p className="text-sm text-gray-500">
            {t("sign.missingSigningTokenDescription")}
          </p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <p className="text-lg font-semibold">{t("sign.loadingError")}</p>
          <p className="text-sm text-gray-500">
            {t("sign.loadingErrorDescription")}
          </p>
        </div>
      </div>
    );
  }

  if (status === "completed") {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">{t("sign.documentSigned")}</p>
          <p className="text-sm text-gray-500">
            {t("sign.documentSignedDescription")}
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            {t("sign.backToHomepage")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative w-full h-[80vh]">
      <EmbedSignDocument
        className="w-full h-full"
        host={
          process.env.NEXT_PUBLIC_DOCUMENSO_URL || "https://documenso.myecl.fr"
        }
        name={fullName}
        email={email}
        token={signingToken}
        onDocumentReady={() => {
          if (readyTimeoutRef.current) clearTimeout(readyTimeoutRef.current);
          setStatus("ready");
        }}
        onDocumentCompleted={() => setStatus("completed")}
        onDocumentError={() => setStatus("error")}
        allowDocumentRejection={true}
      />

      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          <div className="text-center">
            <p className="text-lg font-semibold">{t("sign.loading")}</p>
            <p className="text-sm text-gray-500">
              {t("sign.loadingDescription")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignDocumentPage;
