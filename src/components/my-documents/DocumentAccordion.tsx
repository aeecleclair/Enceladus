import { DocumentCard } from "./DocumentCard";

import { AppCoreDocumentsSchemasDocumentsDocument } from "@/api";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";

interface DocumentAccordionProps {
  title: string;
  documents: AppCoreDocumentsSchemasDocumentsDocument[];
}

export const DocumentAccordion = ({
  title,
  documents,
}: DocumentAccordionProps) => {
  return (
    <AccordionItem value={title}>
      <ContextMenu>
        <ContextMenuTrigger>
          <AccordionTrigger>
            <span>{title}</span>
          </AccordionTrigger>
        </ContextMenuTrigger>
      </ContextMenu>
      <AccordionContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
