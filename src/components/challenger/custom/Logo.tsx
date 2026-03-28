import Image from "next/image";

export function Logo() {
  return (
    <Image
      src="https://challenge-centrale-lyon.fr/assets/Logo_complet_d%C3%A9tour%C3%A9.png"
      alt="IC Challenger Logo"
      width={32}
      height={32}
      unoptimized
    />
  );
}
