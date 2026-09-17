export function getSituationLabel(situation?: string) {
  return situation?.split(" : ")[0].toLowerCase();
}

export function getSituationTitle(situation?: string) {
  const parts = situation?.split(" : ");
  return parts?.length === 2 ? parts[1] : "Centrale";
}
