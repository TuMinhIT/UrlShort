import { useQuery } from "@tanstack/react-query";
import { shortenerApi } from "../../../services/shortUrlApi";

export function useUrlHistoryQuery() {
  return useQuery({
    queryKey: ["shortener", "urls"],
    queryFn: shortenerApi.getUrlsByIp,
  });
}
