"use client";

import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

import { useMyMusic } from "@/hooks/useMusic";
import { useUploadMusic } from "@/hooks/useUploadMusic";
import { useDeleteMusic } from "@/hooks/useDeleteMusic";
import { useMusicPlayer } from "@/hooks/MusicProvider";
import Skeleton from "@/helper/Skeleton";

export default function ProfilePage() {
  const uploadMusic = useUploadMusic();
  const deleteMusic = useDeleteMusic();

  const { playSong } = useMusicPlayer();

  const [file, setFile] = useState<File | null>(null);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [songToDelete, setSongToDelete] = useState<any | null>(null);
  const { data: songs = [], isLoading, isError } = useMyMusic(searchQuery);

  const handleSearch = () => {
    setSearchQuery(search.trim());
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);
  };

  const handleUpload = () => {
    if (!file) return;

    uploadMusic.mutate(file, {
      onSuccess: () => {
        toast.success("Music uploaded successfully!");
        setFile(null);
      },

      onError: (error) => {
        toast.error(error instanceof Error ? error.message : "Upload failed");
      },
    });
  };

  const handleDelete = () => {
    if (!songToDelete) return;

    deleteMusic.mutate(songToDelete.id, {
      onSuccess: () => {
        toast.success("Song deleted successfully");
        setSongToDelete(null);
      },

      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Could not delete song",
        );
      },
    });
  };

  return (
    <main className="mx-2 mt-16">
      <section className="text-white">
        {/* Upload */}
        <h1 className="mt-5 text-xl">Upload Music</h1>

        <article className="lg:w-96">
          <label
            htmlFor="upload"
            className="mt-4 block w-full cursor-pointer rounded-lg border border-dashed border-white py-6 text-center">
            <span>{file ? file.name : "Select an MP3 file"}</span>

            <input
              type="file"
              id="upload"
              accept="audio/mpeg,.mp3"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </article>

        {file && (
          <button
            type="button"
            onClick={handleUpload}
            disabled={uploadMusic.isPending}
            className="mt-4 w-full rounded-lg border border-white/20 px-5 py-3 hover:bg-white hover:text-black disabled:opacity-50 lg:w-96">
            {uploadMusic.isPending ? "Uploading..." : "Upload"}
          </button>
        )}

        {/* My Songs */}
        <footer className="mt-10">
          <h2 className="text-xl">My songs</h2>

          {/* Search */}
          <div className="mt-4 flex gap-2 lg:w-96">
            <input
              type="search"
              placeholder="Search songs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="w-full rounded-lg border border-white/20 bg-transparent px-4 py-3 text-white outline-none placeholder:text-white/50 focus:border-white"
            />

            <button
              type="button"
              onClick={handleSearch}
              className="rounded-lg border border-white/20 px-5 py-3 hover:bg-white hover:text-black">
              Search
            </button>
          </div>

          {isLoading && <Skeleton />}

          {/* Error */}
          {isError && (
            <p className="mt-6 text-red-400">Failed to load your songs</p>
          )}

          {/* Songs */}
          {!isLoading && !isError && (
            <section className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {songs.map((song) => (
                <article key={song.id} className="group relative">
                  {/* Cover */}
                  <div
                    onClick={() => playSong(song)}
                    className="cursor-pointer">
                    <div className="aspect-square overflow-hidden rounded-lg bg-white/10">
                      <Image
                        src={song.coverUrl || "/melodias logo.svg"}
                        alt={song.title}
                        width={300}
                        height={300}
                        unoptimized
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                    </div>

                    <h3 className="mt-2 truncate text-sm">{song.title}</h3>

                    <p className="mt-1 truncate text-xs text-[#8B8888]">
                      {song.artist || "Unknown artist"}
                    </p>

                    <p className="mt-1 truncate text-xs text-[#8B8888]">
                      {song.playCount ?? 0} plays
                    </p>
                  </div>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSongToDelete(song);
                    }}
                    disabled={deleteMusic.isPending}
                    className="mt-2 w-full rounded-md border border-red-500/30 px-3 py-2 text-xs text-red-400 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50">
                    {deleteMusic.isPending ? "Deleting..." : "Delete"}
                  </button>
                </article>
              ))}
            </section>
          )}
          {songToDelete && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
              onClick={() => {
                if (!deleteMusic.isPending) {
                  setSongToDelete(null);
                }
              }}>
              <div
                className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#111] p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-semibold text-white">
                  Delete song?
                </h3>

                <p className="mt-2 text-sm text-white/50">
                  Are you sure you want to delete{" "}
                  <span className="text-white">"{songToDelete.title}"</span>?
                  This action cannot be undone.
                </p>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSongToDelete(null)}
                    disabled={deleteMusic.isPending}
                    className="flex-1 rounded-lg border border-white/10 px-4 py-3 text-sm text-white transition hover:bg-white/10 disabled:opacity-50">
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleteMusic.isPending}
                    className="flex-1 rounded-lg bg-red-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50">
                    {deleteMusic.isPending ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Empty */}
          {!isLoading && !isError && songs.length === 0 && (
            <p className="mt-8 text-center text-white/50">
              {searchQuery
                ? `No songs found for "${searchQuery}"`
                : "You haven't uploaded any songs yet."}
            </p>
          )}
        </footer>
      </section>
    </main>
  );
}
