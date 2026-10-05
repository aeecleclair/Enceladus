export const situations = [
  { value: "centrale", label: "Centrale Lyon" },
  { value: "otherschool", label: "Autre école" },
  { value: "corporatepartner", label: "Partenaire entreprise" },
  { value: "other", label: "Autre" },
];

export const difficulties = [
  { value: "discovery", label: "Découverte" },
  { value: "sports", label: "Sportif" },
  { value: "expert", label: "Expert" },
];

export const meetingPlaces = [
  { value: "centrale", label: "Centrale Lyon" },
  { value: "bellecour", label: "Bellecour" },
  { value: "anyway", label: "Peu importe" },
];

export const tShirtSizes = [
  { value: "xs", label: "XS" },
  { value: "s", label: "S" },
  { value: "m", label: "M" },
  { value: "l", label: "L" },
  { value: "xl", label: "XL" },
  { value: "no", label: "Pas de Tshirt" },
];

export const bikeSizes = [
  { value: "xs", label: "XS (< 1m55)" },
  { value: "s", label: "S (1m55 - 1m165)" },
  { value: "m", label: "M (1m65 - 1m80)" },
  { value: "l", label: "L (1m80 - 1m90)" },
  { value: "xl", label: "XL (> 1m90)" },
];

export const difficultyDescriptions = [
  { value: "discovery", label: "Accessible à tous" },
  { value: "sports", label: "Demandant de la préparation" },
  { value: "expert", label: "Le plus exigeant" },
  { value: undefined, label: "Sélectionner un parcours" },
];

export function getLabelFromValue(
  values: { value?: string; label: string }[],
  value?: string,
) {
  const item = values.find((item) => item.value === value);
  return item?.label ?? "Non renseigné";
}
