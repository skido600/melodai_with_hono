"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { Song } from "@/types/music";
import { usePlayMusic } from "./useMusic";

type MusicContextType = {
  currentSong: Song | null;
  isPlaying: boolean;

  currentTime: number;
  duration: number;
  isLoading: boolean;

  playSong: (song: Song) => Promise<void>;
  togglePlay: () => Promise<void>;
  seek: (time: number) => void;
  closePlayer: () => void;
};

const MusicContext = createContext<MusicContextType | null>(null);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ⭐ Play count mutation
  const playMusicMutation = usePlayMusic();

  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const audio = new Audio();

    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      if (Number.isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleDurationChange = () => {
      if (Number.isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      console.log("🎵 Music finished");

      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handlePlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleError = () => {
      console.error("Audio element error");

      setIsLoading(false);
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);

    return () => {
      audio.pause();

      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);

      audio.src = "";
      audio.load();

      audioRef.current = null;
    };
  }, []);

  const playSong = async (song: Song) => {
    const audio = audioRef.current;

    if (!audio) {
      console.error("Audio element not ready");
      return;
    }

    try {
      setIsLoading(true);

      // Same song
      if (currentSong?.id === song.id) {
        if (!audio.paused) {
          setIsLoading(false);
          return;
        }

        await audio.play();

        setIsPlaying(true);
        setIsLoading(false);

        // Don't increase play count when simply resuming
        return;
      }

      // New song
      audio.pause();

      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);

      setCurrentSong(song);

      audio.src = song.audioUrl;
      audio.load();

      // Wait until browser successfully starts playback
      await audio.play();

      setIsPlaying(true);
      setIsLoading(false);

      // ⭐ Record ONE play for this new song
      playMusicMutation.mutate(song.id);
    } catch (error) {
      console.error("Audio play failed:", error);

      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  const togglePlay = async () => {
    const audio = audioRef.current;

    if (!audio || !currentSong) {
      return;
    }

    try {
      if (audio.paused) {
        setIsLoading(true);

        await audio.play();

        setIsPlaying(true);
        setIsLoading(false);
      } else {
        audio.pause();

        setIsPlaying(false);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);

      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  const seek = (time: number) => {
    const audio = audioRef.current;

    if (!audio) return;
    if (!Number.isFinite(time)) return;

    const newTime = Math.max(0, Math.min(time, audio.duration || 0));

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const closePlayer = () => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.pause();
    audio.src = "";
    audio.load();

    setCurrentSong(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setIsLoading(false);
  };

  return (
    <MusicContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        isLoading,
        playSong,
        togglePlay,
        seek,
        closePlayer,
      }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusicPlayer() {
  const context = useContext(MusicContext);

  if (!context) {
    throw new Error("useMusicPlayer must be used inside MusicProvider");
  }

  return context;
}
