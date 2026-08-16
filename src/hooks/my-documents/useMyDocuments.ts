export const useMyDocuments = () => {
  return {
    documents: [
      {
        id: "1",
        title: "Document 1",
        status: "signed",
        createdAt: "2026-01-01",
      },
      {
        id: "2",
        title: "Document 2",
        status: "pending",
        createdAt: "2026-02-01",
      },
    ] as {
      id: string;
      title: string;
      status: "signed" | "pending" | "rejected";
      createdAt: string;
    }[],
  };
};
