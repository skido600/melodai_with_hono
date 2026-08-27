import { parseBuffer } from "music-metadata";
import cloudinary from "../configs/cloudinary";

export type MusicMetadata = {
  title?: string;
  artist?: string;
  album?: string;
  albumArtist?: string;
  genre?: string;
  year?: number;

  duration?: number;
  bitrate?: number;
  sampleRate?: number;

  codec?: string;
  container?: string;

  cover?: {
    publicId: string;
    url: string;
  };
};

export async function extractMusicMetadata(
  url: string,
  mimeType: string,
  fileSize: number,
): Promise<MusicMetadata> {
  console.log("Downloading audio from Cloudinary...");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to download audio: ${response.status} ${response.statusText}`,
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  console.log(`Downloaded ${buffer.length} bytes`);

  if (!buffer.length) {
    throw new Error("Audio file is empty");
  }

  console.log("Extracting music metadata...");

  const metadata = await parseBuffer(buffer, {
    mimeType,
    size: fileSize,
  });

  const common = metadata.common;
  const format = metadata.format;

  let cover: MusicMetadata["cover"];

  // Extract embedded album artwork
  const picture = common.picture?.[0];

  if (picture) {
    console.log("Album artwork found. Uploading cover...");

    const base64 = Buffer.from(picture.data).toString("base64");

    const dataUri = `data:${picture.format};base64,${base64}`;

    const uploadedCover = await cloudinary.uploader.upload(dataUri, {
      resource_type: "image",
      folder: "melodia/covers",
    });

    cover = {
      publicId: uploadedCover.public_id,
      url: uploadedCover.secure_url,
    };

    console.log("Cover uploaded successfully");
  }

  return {
    title: common.title,
    artist: common.artist,
    album: common.album,
    albumArtist: common.albumartist,

    genre: common.genre?.[0],
    year: common.year,

    duration: format.duration,

    bitrate: format.bitrate ? Math.round(format.bitrate) : undefined,

    sampleRate: format.sampleRate ? Math.round(format.sampleRate) : undefined,

    codec: format.codec,
    container: format.container,

    cover,
  };
}
