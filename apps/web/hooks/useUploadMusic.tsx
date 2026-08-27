"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getMusicSignature,
  uploadToCloudinary,
  completeMusicUpload,
} from "@/util/music-api";

async function uploadMusic(file: File) {
  const signature = await getMusicSignature();

  const cloudinaryData = await uploadToCloudinary(file, signature);

  const song = await completeMusicUpload({
    secureUrl: cloudinaryData.secure_url,
    publicId: cloudinaryData.public_id,
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type,
  });

  return song;
}

export function useUploadMusic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadMusic,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["music", "all"],
      });

      queryClient.invalidateQueries({
        queryKey: ["music", "recent"],
      });

      queryClient.invalidateQueries({
        queryKey: ["music", "my"],
      });
    },
  });
}
