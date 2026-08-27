export type Song = {
  id: string;
  userId?: string;

  title: string;
  artist: string | null;
  album: string | null;
  albumArtist: string | null;

  duration: number | null;
  genre: string | null;
  year: number | null;

  bitrate: number | null;
  sampleRate: number | null;
  codec: string | null;
  container: string | null;

  playCount: number;

  fileName: string;
  fileSize: number;
  mimeType: string;

  audioPubId: string;
  audioUrl: string;

  coverPubId: string | null;
  coverUrl: string | null;

  createdAt: string;

  // Added by your joined queries
  uploadedBy?: string | null;
  uploadedById?: string;
};

export type ApiKey = {
  id: string;
  name: string;
  apiKey: string;
  active: boolean;
  createdAt: string;
  lastUsedAt: string | null;
};
