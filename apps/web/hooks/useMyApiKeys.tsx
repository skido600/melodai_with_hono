import { getMyApiKeys } from "@/util/music-api";
import { useQuery } from "@tanstack/react-query";
import type { ApiKey } from "@/types/music";

export function useMyApiKeys() {
  return useQuery<ApiKey[]>({
    queryKey: ["api-keys"],
    queryFn: getMyApiKeys,
  });
}
