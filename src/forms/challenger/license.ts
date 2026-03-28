import { z } from "zod";

export const licenseFormSchema = z.object({
  license_number: z
    .string()
    .min(1, "Le numéro de licence est requis pour valider l'inscription."),
  certificate: z
    .any()
    .refine((file) => {
      if (!file) return true;
      const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
      return file.size <= maxSizeInBytes;
    }, "Le fichier doit faire moins de 10MB")
    .refine((file) => {
      if (!file) return true;
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      return allowedTypes.includes(file.type);
    }, "Le fichier doit être au format PDF, JPEG ou PNG"),
});

export type LicenseFormValues = z.infer<typeof licenseFormSchema>;
