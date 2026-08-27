import { getMyApiKeys } from "@/util/music-api";
import { useQuery } from "@tanstack/react-query";
import type { ApiKey } from "@/types/music";

export function useMyApiKeys() {
  return useQuery<ApiKey[]>({
    queryKey: ["my-api-keys"],
    queryFn: getMyApiKeys,
  });
}
