"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Skeleton from "@/helper/Skeleton";
import { useAllMusic } from "@/hooks/useMusic";
import { useMusicPlayer } from "@/hooks/MusicProvider";
import type { Song } from "@/types/music";

export default function SearchPage() {
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");

  const { data: songs = [], isLoading, isError } = useAllMusic(search);
  const { playSong } = useMusicPlayer();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(input.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [input]);

  return (
    <main className="mt-16 px-2 text-white">
      <h1 className="mb-6 text-[24px] font-bold">Search Music</h1>

      <div className="mb-8">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search by title or artist..."
          className="w-full rounded-xl border border-white/10 bg-[#181818] px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-[#83DAA1]"
        />
      </div>

      {isLoading && <Skeleton />}

      {isError && !isLoading && (
        <p className="text-red-400">Failed to load music</p>
      )}

      {!isLoading && !isError && songs.length === 0 && (
        <p className="text-white/50">
          {search ? `No music found for "${search}"` : "No music available"}
        </p>
      )}

      {!isLoading && songs.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold">
            {search ? `Results for "${search}"` : "All Music"}
          </h2>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {songs.map((song: Song) => (
              <article
                key={song.id}
                onClick={() => playSong(song)}
                className="group cursor-pointer">
                <div className="aspect-square overflow-hidden rounded-lg bg-[#181818]">
                  <Image
                    src={song.coverUrl || "/melodias logo.svg"}
                    alt={song.title || "Song cover"}
                    width={300}
                    height={300}
                    unoptimized
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="mt-2">
                  <h3 className="truncate text-sm text-white">{song.title}</h3>

                  <p className="mt-1 truncate text-xs text-[#8B8888]">
                    {song.artist || "Unknown artist"}
                  </p>

                  <p className="mt-1 truncate text-xs text-[#8B8888]">
                    Uploaded by {song.uploadedBy || "Unknown"}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
