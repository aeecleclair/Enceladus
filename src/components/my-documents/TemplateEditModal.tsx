import { CustomDialog } from "../common/CustomDialog";

import { Template } from "@/api";

import { Button } from "../ui/button";

export const TemplateEditModal = ({
  isOpen,
  onClose,
  onSubmit,
  template,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (updatedTemplate: Template) => void;
  template: Template;
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const updatedTemplate: Template = {
          ...template,
          name: (e.target as any).name.value,
          document_directory_id: (e.target as any).documentDirectoryId.value,
        };
        onSubmit(updatedTemplate);
      }}
    >
      <div className="mb-4">
        <label
          className="block text-sm font-medium mb-1"
          htmlFor="documentDirectoryId"
        >
          Document Directory ID
        </label>
        <input
          type="text"
          id="documentDirectoryId"
          className="w-full border border-gray-300 rounded-md p-2 dark:bg-zinc-700 dark:text-white"
          defaultValue={template.document_directory_id ?? ""}
        />
      </div>
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          className="mr-2"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};
