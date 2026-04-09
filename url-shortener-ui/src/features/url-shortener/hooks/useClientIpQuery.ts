import { useQuery } from "@tanstack/react-query";
import { shortenerApi } from "../../../services/shortUrlApi";

export function useClientIpQuery() {
  return useQuery({
    queryKey: ["shortener", "client-ip"],
    queryFn: shortenerApi.fetchPublicIp,
    staleTime: 24 * 60 * 60 * 1000,
  });
}
