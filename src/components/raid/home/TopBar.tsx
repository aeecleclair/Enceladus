import { UserButton } from "./userSheet/UserButton";

import Link from "next/link";

export const TopBar = () => {
  return (
    <header className="max-md:sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-10">
      <nav className="flex flex-row w-full mx-10 max-md:mx-0 items-center">
        <Link
          href="#"
          className="flex items-center gap-2 font-semibold md:text-base"
        >
          <span className=" text-2xl">
            Inscription Raid {new Date().getFullYear()}
          </span>
        </Link>
        <div className="flex flex-row ml-auto">
          <UserButton />
        </div>
      </nav>
    </header>
  );
};
