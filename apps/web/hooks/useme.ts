// hooks/useMe.ts

import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/util/music-api";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
  });
}
