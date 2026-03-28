import { SchoolExtension } from "@/api";

export interface SchoolTypeInfo {
  label: string;
  variant: "default" | "secondary" | "outline";
  className: string;
}

/**
 * Determines the school type and returns appropriate badge styling
 * @param school - The school extension object
 * @returns School type information for badge display
 */
export const getSchoolType = (school: SchoolExtension): SchoolTypeInfo => {
  // Special case for École Centrale Lyon (check by ID)
  if (school.school_id === "d9772da7-1142-4002-8b86-b694b431dfed") {
    return {
      label: "Centrale Lyon",
      variant: "outline",
      className: "border-orange-500 text-orange-700 bg-orange-50",
    };
  }

  // Regular cases based on from_lyon property
  if (school.from_lyon) {
    return {
      label: "École Lyonnaise",
      variant: "default",
      className: "",
    };
  } else {
    return {
      label: "École Externe",
      variant: "secondary",
      className: "",
    };
  }
};
