import  { EventFormValues } from "@/forms/sg/eventFormSchema";
import  { SessionFormValues } from "@/forms/sg/sessionFormSchema";

// Create a type that represents all possible paths in the form, including nested paths
type FormFieldPath =
  | keyof EventFormValues
  | keyof SessionFormValues; 

// Define the header subtitle options based on the actual values used
export type HeaderSubtitle =
  | "Création de l'évènement"
  | "Ajout des sessions"
  | "Ajout des catégories"
  | "Récapitulatif";

export default interface AddEventState {
  currentStep: number;
  stepDone: number;
  headerTitle: string;
  headerSubtitle: HeaderSubtitle;
  allHeaderSubtitles: HeaderSubtitle[];
  pageFields: Record<HeaderSubtitle, FormFieldPath[]>;
  onValidateCardActions: Record<
    HeaderSubtitle,
    (data: EventFormValues | SessionFormValues, callback: () => void) => void
  >;
}
