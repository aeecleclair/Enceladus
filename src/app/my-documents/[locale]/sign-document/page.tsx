"use client";
import { EmbedSignDocument } from "@documenso/embed-react";
import { useSearchParams } from "next/navigation";
const SignDocumentPage = () => {
  const searchParams = useSearchParams();
  const signingToken = searchParams.get("signing-token");
  if (!signingToken) {
    return <div>Missing signing token</div>;
  }
  return (
    <EmbedSignDocument
      host="https://documenso.myecl.fr"
      name="John Doe"
      token={signingToken}
      onDocumentCompleted={(data) => {
        console.log("Signed:", data.documentId);
      }}
    />
  );
};

//   /fr/sign-document?signingToken=pQtKNbhb71E7O2cQxf9uf

export default SignDocumentPage;
