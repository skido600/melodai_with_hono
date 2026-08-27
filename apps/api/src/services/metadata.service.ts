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
  buffer: Buffer,
  mimeType: string,
  fileSize: number,
): Promise<MusicMetadata> {
  const metadata = await parseBuffer(buffer, {
    mimeType,
    size: fileSize,
  });

  const common = metadata.common;
  const format = metadata.format;

  let cover: MusicMetadata["cover"] = undefined;

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

    console.log("Cover uploaded:", uploadedCover.secure_url);
  } else {
    console.log("No embedded cover found");
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
