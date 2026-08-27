"use client";
import Skeleton from "@/helper/Skeleton";
import { useMusicPlayer } from "@/hooks/MusicProvider";
import { useTopMusic } from "@/hooks/useMusic";
import Image from "next/image";
import React from "react";

function WhatNew() {
  const { data: songs, isLoading, isError } = useTopMusic();
  const { playSong } = useMusicPlayer();
  console.log("topmu", songs);
  if (isError) {
    return (
      <main className="mt-3 text-white">
        <h1 className="mb-4 text-[24px] font-bold">Top Six</h1>
        <p className="text-red-400">Failed to load top songs</p>
      </main>
    );
  }

  return (
    <main className="text-white mt-3">
      <h1 className="font-bold text-[24px] mb-4">Top Six</h1>
      {isLoading && <Skeleton />}
      <section className="flex overflow-x-auto hide-scrollbar gap-3 overflow-y-hidden py-4">
        {songs?.map((song) => (
          <article
            key={song.id}
            onClick={() => playSong(song)}
            className="-mt-4 shrink-0 w-37.5">
            <Image
              src={song.coverUrl || "/melodias logo.svg"}
              alt={song.title || "Song cover"}
              width={200}
              height={200}
              className="object-cover"
            />

            <div className="mt-2">
              <h3 className="text-[#FFFFFF] text-sm">{song.title}</h3>

              <p className="text-[#8B8888] text-xs mt-1">
                {song.artist || "Unknown artist"}
              </p>
              <p className="text-[#8B8888] truncate text-xs mt-1">
                Uploaded by {song.uploadedBy}
              </p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default WhatNew;
