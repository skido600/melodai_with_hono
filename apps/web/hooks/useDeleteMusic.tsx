import { deleteMusic } from "@/util/music-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteMusic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (songId: string) => deleteMusic(songId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-music"],
      });

      queryClient.invalidateQueries({
        queryKey: ["music"],
      });

      queryClient.invalidateQueries({
        queryKey: ["recent-music"],
      });

      queryClient.invalidateQueries({
        queryKey: ["top-music"],
      });
    },
  });
}
