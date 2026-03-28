import { z } from "zod";
import { SportCategory } from "../api/hyperionSchemas";

export const sportCategories = [
  { value: "masculine", label: "Masculin" },
  { value: "feminine", label: "Féminin" },
  { value: "null", label: "Mixte" },
] satisfies {
  value: SportCategory | "null";
  label: string;
}[];

export const sportFormSchema = z.object({
  name: z
    .string({
      required_error: "Veuillez renseigner le nom du sport",
    })
    .min(1, {
      message: "Veuillez renseigner le nom du sport",
    }),
  teamSize: z.number().min(1, {
    message: "La taille de l'équipe doit être supérieure à 0",
  }),
  sportCategory: z.enum(
    sportCategories.map((cat) => cat.value) as [SportCategory | "null"],
    {
      required_error: "Veuillez sélectionner une catégorie de sport",
    },
  ),
  substituteMax: z.number().min(0, {
    message: "Le nombre de remplaçants doit être supérieur ou égal à 0",
  }),
  active: z.boolean({
    required_error: "Veuillez indiquer si le sport est activé",
  }),
});

export type SportFormValues = z.infer<typeof sportFormSchema>;
