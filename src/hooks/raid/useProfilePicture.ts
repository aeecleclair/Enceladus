import { getUsersMeProfilePictureOptions } from "@/api/@tanstack/react-query.gen";
import { useAuth } from "@/app/authContext";

import { useQuery } from "@tanstack/react-query";

export const useProfilePicture = () => {
  const { isTokenExpired } = useAuth();

  const { data, isLoading } = useQuery({
    ...getUsersMeProfilePictureOptions(),
    enabled: !isTokenExpired(),
    retry: 0,
  });

  return { profilePicture: data as File, isLoading };
};
