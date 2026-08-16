"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { EmbedSignDocument } from "@documenso/embed-react";

const SignDocumentPage = () => {
  const searchParams = useSearchParams();
  const signingToken = searchParams.get("signingToken");

  const [isSigned, setSignedStatus] = useState(false);

  if (!signingToken) {
    return <div>Missing signing token</div>;
  }
  return !isSigned ? (
    <EmbedSignDocument
      className="w-full h-screen"
      host="https://documenso.myecl.fr"
      name="John Doe"
      token={signingToken}
      onDocumentCompleted={() => {
        setSignedStatus(true);
      }}
    />
  ) : (
    <div className="flex h-screen items-center justify-center">
      Document signed successfully!
    </div>
  );
};

//   /fr/sign-document?signingToken=pQtKNbhb71E7O2cQxf9uf

export default SignDocumentPage;
