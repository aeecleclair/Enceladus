// import { getPmfOffersOptions } from "@/api/@tanstack/react-query.gen";
// import { useAuth } from "@/app/authContext";

// import { useQuery } from "@tanstack/react-query";

// export const useOffers = () => {
//   const { isTokenExpired } = useAuth();
//   const { data, isLoading, refetch } = useQuery({
//     ...getPmfOffersOptions(),
//     retry: 3,
//     enabled: !isTokenExpired(),
//   });
//   return {
//     offers: data?.data || [],
//     isLoading,
//     refetch,
//   };
// };
