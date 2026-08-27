import { parseBuffer } from "music-metadata";

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
  console.log("METADATA: downloading:", url);

  const response = await fetch(url);

  console.log("METADATA: response:", response.status);

  if (!response.ok) {
    throw new Error(
      `Failed to download audio: ${response.status} ${response.statusText}`,
    );
  }

  const arrayBuffer = await response.arrayBuffer();

  console.log("METADATA: downloaded bytes:", arrayBuffer.byteLength);

  if (arrayBuffer.byteLength === 0) {
    throw new Error("Audio file is empty");
  }

  const buffer = Buffer.from(arrayBuffer);

  console.log("METADATA: parsing...");

  const metadata = await parseBuffer(
    buffer,
    {
      mimeType,
      size: fileSize,
    },
    {
      duration: true,
      skipCovers: true,
    },
  );

  console.log("METADATA: parsed successfully");

  const common = metadata.common;
  const format = metadata.format;

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

    cover: undefined,
  };
}
