import { generateApiKey } from "@/util/music-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useGenerateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => generateApiKey(name),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-api-keys"],
      });
    },
  });
}
