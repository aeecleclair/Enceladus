import {
  CoreUserSimple,
  getUsersSearch,
  postCdrUsersUserIdCurriculumsCurriculumId,
} from "@/api";
import { CustomDialog } from "@/components/common/CustomDialog";
import { LoadingButton } from "@/components/common/LoadingButton";
import { useCurriculums } from "@/hooks/siarnaq/useCurriculums";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { HiOutlinePlusCircle } from "react-icons/hi2";

import { Button } from "@/components/ui/button";
import { Command, CommandItem } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

function getDisplayName(user: CoreUserSimple) {
  if (!user.nickname) {
    return `${user.firstname} ${user.name}`;
  }
  return `${user.firstname} ${user.name} (${user.nickname})`;
}

export const AddUserWithCurriculum = () => {
  const t = useTranslations("siarnaq");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  async function submit() {
    setIsLoading(true);
    if (!selectedCurriculum || !selectedUser) {
      setIsLoading(false);
      return;
    }

    const { error: patchError } =
      await postCdrUsersUserIdCurriculumsCurriculumId({
        path: {
          user_id: selectedUser.id,
          curriculum_id: selectedCurriculum,
        },
      });
    const error = patchError;

    if (error) {
      toast({
        description: error.detail,
        variant: "destructive",
      });
      setIsLoading(false);
      setIsOpened(false);
      return;
    }
    setSelectedUser(undefined as unknown as CoreUserSimple);
    setQuery(undefined as unknown as string);
    setIsOpened(false);
    setIsLoading(false);
  }

  const [isOpened, setIsOpened] = useState(false);
  const { curriculums } = useCurriculums();
  const [selectedCurriculum, setSelectedCurriculum] = useState(
    curriculums.length > 0 ? curriculums[0].id : undefined,
  );

  const [query, setQuery] = useState(undefined as unknown as string);
  const [foundUsers, setFoundUsers] = useState([] as CoreUserSimple[]);

  const [selectedUser, setSelectedUser] = useState(
    undefined as unknown as CoreUserSimple,
  );

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => setIsOpened(true)}
        className="h-8"
      >
        <HiOutlinePlusCircle className="mr-2 h-4" />
        {t("addUserWithCurriculum.add")}
      </Button>
      <CustomDialog
        isOpened={isOpened}
        setIsOpened={setIsOpened}
        title={t("addUserWithCurriculum.addCurriculumToUser")}
        description={
          <div className="grid gap-6 mt-4">
            <div className="grid gap-2">
              <Label>{t("addUserWithCurriculum.curriculum")}</Label>
              <Select
                onValueChange={setSelectedCurriculum}
                defaultValue={selectedCurriculum}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent side="top">
                  {curriculums.map((curriculum) => (
                    <SelectItem key={curriculum.id} value={curriculum.id}>
                      <div className="flex items-center flex-row gap-2">
                        {curriculum.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>{t("addUserWithCurriculum.user")}</Label>

              <Input
                type="text"
                placeholder={
                  selectedUser
                    ? getDisplayName(selectedUser)
                    : t("addUserWithCurriculum.searchUser")
                }
                onChange={(query: React.ChangeEvent<HTMLInputElement>) => {
                  setQuery(query.target.value);
                  setSelectedUser(undefined as unknown as CoreUserSimple);

                  getUsersSearch({
                    query: {
                      query: query.target.value,
                    },
                  }).then((result) => {
                    setFoundUsers(result.data || []);
                  });
                }}
                value={selectedUser ? getDisplayName(selectedUser) : query}
              />

              <Command>
                <ScrollArea className="">
                  {foundUsers.map((user) => (
                    <CommandItem
                      key={user.id}
                      value={user.id}
                      onSelect={(userId) => {
                        setSelectedUser(user);
                        setFoundUsers([]);
                      }}
                    >
                      {getDisplayName(user)}
                    </CommandItem>
                  ))}
                </ScrollArea>
              </Command>

              <div className="flex justify-end mt-2 space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setIsOpened(false)}
                  disabled={isLoading}
                  className="w-25"
                >
                  {t("addUserWithCurriculum.cancel")}
                </Button>
                <LoadingButton
                  isLoading={isLoading}
                  className="w-25"
                  type="button"
                  disabled={!selectedUser || !selectedCurriculum}
                  onClick={submit}
                >
                  {t("addUserWithCurriculum.add")}
                </LoadingButton>
              </div>
            </div>
          </div>
        }
      ></CustomDialog>
    </>
  );
};
