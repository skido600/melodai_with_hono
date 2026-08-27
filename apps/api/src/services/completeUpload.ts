import type { Context } from "hono";
import { db } from "../configs";
import { songs, users } from "../configs/schema";
import { extractMusicMetadata } from "../services/metadata.service";
import { desc, eq, ilike, and, sql, or } from "drizzle-orm";
// export async function completeMusicUpload(c: Context) {
//   try {
//     const userId = c.get("userId");

//     if (!userId) {
//       return c.json(
//         {
//           success: false,
//           message: "Unauthorized",
//           data: null,
//         },
//         401,
//       );
//     }

//     const { secureUrl, publicId, fileName, fileSize, mimeType } =
//       await c.req.json();

//     if (!secureUrl || !publicId || !fileName || !fileSize || !mimeType) {
//       return c.json(
//         {
//           success: false,
//           message: "Missing upload information",
//           data: null,
//         },
//         400,
//       );
//     }

//     const audioResponse = await fetch(secureUrl);

//     if (!audioResponse.ok) {
//       throw new Error(`Cloudinary download failed: ${audioResponse.status}`);
//     }

//     const arrayBuffer = await audioResponse.arrayBuffer();

//     const buffer = Buffer.from(arrayBuffer);

//     const metadata = await extractMusicMetadata(buffer, mimeType, fileSize);

//     const [song] = await db
//       .insert(songs)
//       .values({
//         userId,

//         title: metadata.title ?? fileName.replace(/\.[^/.]+$/, ""),

//         artist: metadata.artist ?? null,

//         album: metadata.album ?? null,

//         albumArtist: metadata.albumArtist ?? null,

//         genre: metadata.genre ?? null,

//         year: metadata.year ?? null,

//         duration: metadata.duration ?? null,

//         bitrate: metadata.bitrate ?? null,

//         sampleRate: metadata.sampleRate ?? null,

//         codec: metadata.codec ?? null,

//         container: metadata.container ?? null,

//         fileName,

//         fileSize,

//         mimeType,

//         audioPubId: publicId,

//         audioUrl: secureUrl,

//         coverPubId: metadata.cover?.publicId ?? null,

//         coverUrl: metadata.cover?.url ?? null,
//       })
//       .returning();

//     return c.json({
//       success: true,
//       message: "Music uploaded successfully",
//       data: song,
//     });
//   } catch (error) {
//     console.error("Complete music upload error:", error);

//     return c.json(
//       {
//         success: false,
//         message: "Could not process music",
//         data: error,
//       },
//       500,
//     );
//   }
// }
export async function completeMusicUpload(c: Context) {
  return c.json({
    success: true,
    message: "test",
  });
}
export async function getAllMusic(c: Context) {
  try {
    const query = c.req.query("q")?.trim();

    const conditions = query
      ? or(ilike(songs.title, `%${query}%`), ilike(songs.artist, `%${query}%`))
      : undefined;
    const result = await db
      .select({
        id: songs.id,
        title: songs.title,
        artist: songs.artist,
        album: songs.album,
        albumArtist: songs.albumArtist,
        duration: songs.duration,
        genre: songs.genre,
        year: songs.year,
        bitrate: songs.bitrate,
        sampleRate: songs.sampleRate,
        codec: songs.codec,
        container: songs.container,
        playCount: songs.playCount,

        fileName: songs.fileName,
        fileSize: songs.fileSize,
        mimeType: songs.mimeType,

        audioPubId: songs.audioPubId,
        audioUrl: songs.audioUrl,

        coverPubId: songs.coverPubId,
        coverUrl: songs.coverUrl,

        createdAt: songs.createdAt,

        uploadedBy: users.name,
        uploadedById: users.id,
      })
      .from(songs)
      .leftJoin(users, eq(songs.userId, users.id))
      .where(conditions)
      .orderBy(desc(songs.createdAt));

    return c.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get music error:", error);

    return c.json(
      {
        success: false,
        message: "Could not get music",
        data: error,
      },
      500,
    );
  }
}

export async function getMyMusic(c: Context) {
  try {
    const userId = c.get("userId");

    if (!userId) {
      return c.json(
        {
          success: false,
          message: "Unauthorized",
          data: null,
        },
        401,
      );
    }

    const query = c.req.query("q")?.trim();

    const conditions = query
      ? and(
          eq(songs.userId, userId),
          or(
            ilike(songs.title, `%${query}%`),
            ilike(songs.artist, `%${query}%`),
            ilike(songs.album, `%${query}%`),
          ),
        )
      : eq(songs.userId, userId);

    const result = await db
      .select()
      .from(songs)
      .where(conditions)
      .orderBy(desc(songs.createdAt));

    return c.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get my music error:", error);

    return c.json(
      {
        success: false,
        message: "Could not get your music",
        data: null,
      },
      500,
    );
  }
}

export async function getRecentMusic(c: Context) {
  try {
    const result = await db
      .select({
        id: songs.id,
        title: songs.title,
        artist: songs.artist,
        album: songs.album,
        duration: songs.duration,
        playCount: songs.playCount,

        audioUrl: songs.audioUrl,
        coverUrl: songs.coverUrl,

        createdAt: songs.createdAt,

        uploadedBy: users.name,
        uploadedById: users.id,
      })
      .from(songs)
      .leftJoin(users, eq(songs.userId, users.id))
      .orderBy(desc(songs.createdAt))
      .limit(10);

    return c.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get recent music error:", error);

    return c.json(
      {
        success: false,
        message: "Could not get recent music",
        data: null,
      },
      500,
    );
  }
}

export async function playMusic(c: Context) {
  try {
    const songId = c.req.param("id");
    if (!songId) {
      return c.json(
        {
          success: false,
          message: "Song ID is required",
          data: null,
        },
        400,
      );
    }
    const [song] = await db
      .update(songs)
      .set({
        playCount: sql`${songs.playCount} + 1`,
      })
      .where(eq(songs.id, songId))
      .returning({
        id: songs.id,
        playCount: songs.playCount,
      });

    if (!song) {
      return c.json(
        {
          success: false,
          message: "Song not found",
          data: null,
        },
        404,
      );
    }

    return c.json({
      success: true,
      data: song,
    });
  } catch (error) {
    console.error("Play music error:", error);

    return c.json(
      {
        success: false,
        message: "Could not record play",
        data: null,
      },
      500,
    );
  }
}

export async function getTopMusic(c: Context) {
  try {
    const result = await db
      .select({
        id: songs.id,
        title: songs.title,
        artist: songs.artist,
        album: songs.album,
        duration: songs.duration,

        playCount: songs.playCount,

        audioUrl: songs.audioUrl,
        coverUrl: songs.coverUrl,

        createdAt: songs.createdAt,

        uploadedBy: users.name,
        uploadedById: users.id,
      })
      .from(songs)
      .innerJoin(users, eq(songs.userId, users.id))
      .where(sql`${songs.playCount} > 4`)
      .orderBy(desc(songs.playCount))
      .limit(6);

    return c.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get top music error:", error);

    return c.json(
      {
        success: false,
        message: "Could not get top music",
        data: null,
      },
      500,
    );
  }
}
export async function getDeveloperMusic(c: Context) {
  try {
    const result = await db
      .select({
        title: songs.title,
        artist: songs.artist,
        year: songs.year,
        album: songs.album,
        duration: songs.duration,
        albumArtist: songs.albumArtist,
        playCount: songs.playCount,
        musicurl: songs.audioUrl,
        coverphotourl: songs.coverUrl,
      })
      .from(songs)
      .orderBy(desc(songs.createdAt))
      .limit(20);

    const data = result.map((song, index) => ({
      id: index + 1,
      title: song.title,
      artist: song.artist,
      year: song.year,
      album: song.album,
      duration: song.duration,
      audioUrl: song.musicurl,
      coverUrl: song.coverphotourl,
    }));
    return c.json({
      success: true,
      message: "Music fetched successfully",
      count: result.length,
      data: data,
    });
  } catch (error) {
    console.error("Get developer music error:", error);

    return c.json(
      {
        success: false,
        message: "Could not get music",
        data: null,
      },
      500,
    );
  }
}

export async function deleteMusic(c: Context) {
  try {
    const userId = c.get("userId");
    const songId = c.req.param("id");

    if (!userId) {
      return c.json(
        {
          success: false,
          message: "Unauthorized",
          data: null,
        },
        401,
      );
    }

    if (!songId) {
      return c.json(
        {
          success: false,
          message: "Song ID is required",
          data: null,
        },
        400,
      );
    }

    const [deletedSong] = await db
      .delete(songs)
      .where(and(eq(songs.id, songId), eq(songs.userId, userId)))
      .returning({
        id: songs.id,
        title: songs.title,
      });

    if (!deletedSong) {
      return c.json(
        {
          success: false,
          message: "Music not found or you do not own this music",
          data: null,
        },
        404,
      );
    }

    return c.json({
      success: true,
      message: "Music deleted successfully",
      data: deletedSong,
    });
  } catch (error) {
    console.error("Delete music error:", error);

    return c.json(
      {
        success: false,
        message: "Could not delete music",
        data: null,
      },
      500,
    );
  }
}

// export async function
