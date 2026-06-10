import { ViewEditUserInfo } from "./ViewEditUserInfo";
import { LogoutButton } from "./logoutButton";

import { ThemeButton } from "@/components/raid/custom/ThemeButton";
import { useInformation } from "@/hooks/raid/useInformation";
import { useMeParticipant } from "@/hooks/raid/useMeParticipant";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

export const UserButton = () => {
  const { me } = useMeParticipant();
  const { information } = useInformation();
  // const { profilePicture } = useProfilePicture();
  const [isOpened, setIsOpened] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  function onOpenChange() {
    if (isOpened) {
      setIsEdit(false);
    }
    setIsOpened(!isOpened);
  }

  function contactUs() {
    window.open(`mailto:${information?.contact}`);
  }

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>
          {me?.firstname === undefined || me?.name === undefined ? (
            <>
              {/* <Skeleton className="w-10 h-10 rounded-full" />
              <div className="mr-2" /> */}
              <Skeleton className="w-24 h-6" />
            </>
          ) : (
            <>
              {/* <Avatar className="mr-2 mb-1">
                {profilePicture && (
                  <AvatarImage
                    src={URL.createObjectURL(profilePicture)}
                    alt={me.firstname + " " + me.name}
                  />
                )}
                <AvatarFallback>
                  {me.firstname.charAt(0) + me.name.charAt(0)}
                </AvatarFallback>
              </Avatar> */}
              {me.firstname + " " + me.name}
            </>
          )}
        </MenubarTrigger>
        <MenubarContent>
          <ThemeButton />
          <MenubarSeparator />
          <Sheet open={isOpened} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="px-2 py-1.5 text-sm font-normal w-full justify-start hover:bg-background"
              >
                Informations du compte
              </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col justify-between">
              <SheetHeader>
                <SheetTitle>Paramètres</SheetTitle>
                <SheetDescription>Information du compte</SheetDescription>
              </SheetHeader>
              {me && (
                <ViewEditUserInfo
                  me={me}
                  isEdit={isEdit}
                  setIsEdit={setIsEdit}
                  setIsOpen={onOpenChange}
                />
              )}
            </SheetContent>
          </Sheet>
          <MenubarSeparator />
          <MenubarItem onClick={contactUs}>Nous contacter</MenubarItem>
          <MenubarSeparator />
          <LogoutButton />
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};
