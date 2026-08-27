import { deleteApiKey } from "@/util/music-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (keyId: string) => deleteApiKey(keyId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-api-keys"],
      });
    },
  });
}
