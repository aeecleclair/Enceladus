import Image from "next/image";

export function Logo() {
  return (
    <Image src="/raid.ico" alt="Raid Logo" width={32} height={32} unoptimized />
  );
}
