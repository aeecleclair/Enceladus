import { RegisteringFormValues } from "@/forms/challenger/registering";

// Create a type that represents all possible paths in the form, including nested paths
type FormFieldPath =
  | keyof RegisteringFormValues // Direct top-level fields like 'phone', 'status', etc.
  | `sport.${keyof NonNullable<RegisteringFormValues["sport"]> & string}`; // Nested sport fields with dot notation

// Define the header subtitle options based on the actual values used
export type HeaderSubtitle =
  | "Informations"
  | "Participation"
  | "Sport"
  | "Panier"
  | "Récapitulatif";

export interface RegisterState {
  currentStep: number;
  stepDone: number;
  headerTitle: string;
  headerSubtitle: HeaderSubtitle;
  allHeaderSubtitles: HeaderSubtitle[];
  pageFields: Record<HeaderSubtitle, FormFieldPath[]>;
  onValidateCardActions: Record<
    HeaderSubtitle,
    (data: RegisteringFormValues, callback: () => void) => void
  >;
}
