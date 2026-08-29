"use client";

import { formatDuration } from "@/helper/durationConversion";
import { useMobile } from "@/hooks/MobileContext";
import { useMusicPlayer } from "@/hooks/MusicProvider";
import Image from "next/image";
import { X, Play, Pause } from "lucide-react";

export function MusicPlayer() {
  const { open } = useMobile();

  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    isLoading,
    togglePlay,
    seek,
    closePlayer,
  } = useMusicPlayer();

  if (!currentSong) return null;

  return (
    <div
      className={`
        fixed
        bottom-0
        right-0
        z-50
        border-t
        border-white/10
        bg-[#101010]
        px-4
        py-3
        text-white
        backdrop-blur-md
        transition-all
        duration-300

        left-0

        ${open ? "ml-16" : "ml-0"}

        lg:left-60
        lg:ml-0
      `}>
      {/* MOBILE */}
      <div className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-2 lg:hidden">
        {/* Song info */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-white/10">
            {currentSong.coverUrl ? (
              <Image
                height={100}
                width={100}
                unoptimized
                src={currentSong.coverUrl}
                alt={currentSong.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">🎵</div>
            )}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-medium">
              {currentSong.title}
            </h3>

            <p className="truncate text-xs text-white/50">
              {currentSong.artist || "Unknown artist"}
            </p>
          </div>
        </div>

        {/* Play / Pause */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={togglePlay}
            disabled={isLoading}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black disabled:opacity-50">
            {isLoading ? (
              "..."
            ) : isPlaying ? (
              <Pause size={17} />
            ) : (
              <Play size={17} />
            )}
          </button>

          <button
            type="button"
            onClick={closePlayer}
            className="ml-2 text-white/60 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Progress */}
        <div className="col-span-2 flex min-w-0 items-center gap-2">
          <span className="shrink-0 text-[10px] text-white/50">
            {formatDuration(currentTime)}
          </span>

          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            disabled={!duration}
            onChange={(e) => {
              seek(Number(e.target.value));
            }}
            className="min-w-0 w-full cursor-pointer"
          />

          <span className="shrink-0 text-[10px] text-white/50">
            {formatDuration(duration)}
          </span>
        </div>
      </div>

      {/* DESKTOP - unchanged */}
      <div className="hidden min-w-0 items-center gap-4 lg:flex">
        {/* Cover */}
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-white/10">
          {currentSong.coverUrl ? (
            <Image
              height={100}
              width={100}
              unoptimized
              src={currentSong.coverUrl}
              alt={currentSong.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">🎵</div>
          )}
        </div>

        {/* Song info */}
        <div className="min-w-0 w-40 shrink">
          <h3 className="truncate text-sm font-medium">{currentSong.title}</h3>

          <p className="truncate text-xs text-white/50">
            {currentSong.artist || "Unknown artist"}
          </p>
        </div>

        {/* Progress */}
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="shrink-0 text-xs text-white/50">
            {formatDuration(currentTime)}
          </span>

          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            disabled={!duration}
            onChange={(e) => {
              seek(Number(e.target.value));
            }}
            className="block min-w-0 w-full cursor-pointer"
          />

          <span className="shrink-0 text-xs text-white/50">
            {formatDuration(duration)}
          </span>
        </div>

        {/* Play / Pause */}
        <button
          type="button"
          onClick={togglePlay}
          disabled={isLoading}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black disabled:opacity-50">
          {isLoading ? (
            "..."
          ) : isPlaying ? (
            <Pause size={17} />
          ) : (
            <Play size={17} />
          )}
        </button>

        {/* Close */}
        <button
          type="button"
          onClick={closePlayer}
          className="shrink-0 text-xl text-white/60 hover:text-white">
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
