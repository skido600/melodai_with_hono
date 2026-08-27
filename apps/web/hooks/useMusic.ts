import { useQuery, useMutation } from "@tanstack/react-query";

import {
  getAllMusic,
  getRecentMusic,
  getTopMusic,
  getMyMusic,
  // searchMusic,
  playMusic,
} from "@/util/music-api";
import type { Song } from "@/types/music";
export function useAllMusic(query = "") {
  return useQuery<Song[]>({
    queryKey: ["music", "all", query],
    queryFn: () => getAllMusic(query),
  });
}

export function useRecentMusic() {
  return useQuery<Song[]>({
    queryKey: ["music", "recent"],
    queryFn: getRecentMusic,
  });
}

export function useTopMusic() {
  return useQuery<Song[]>({
    queryKey: ["music", "top"],
    queryFn: getTopMusic,
  });
}

export function useMyMusic(query = "") {
  return useQuery<Song[]>({
    queryKey: ["music", "my", query],
    queryFn: () => getMyMusic(query),
  });
}
export function usePlayMusic() {
  return useMutation({
    mutationFn: playMusic,
  });
}
