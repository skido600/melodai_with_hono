import { parseWebStream } from "music-metadata";
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
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to download audio: ${response.status} ${response.statusText}`,
    );
  }

  if (!response.body) {
    throw new Error("Audio response has no body");
  }

  const metadata = await parseWebStream(
    response.body,
    {
      mimeType,
      size: fileSize,
    },
    {
      duration: true,
      skipCovers: false,
    },
  );

  const common = metadata.common;
  const format = metadata.format;

  let cover: MusicMetadata["cover"];

  const picture = common.picture?.[0];

  if (picture) {
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
