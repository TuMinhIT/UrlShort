import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shortenerApi } from "../../../services/shortUrlApi";
import type { CreateShortUrlRequest } from "../types";

export function useCreateShortUrlMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateShortUrlRequest) =>
      shortenerApi.createShortUrl(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["shortener", "urls"],
      });
    },
  });
}
