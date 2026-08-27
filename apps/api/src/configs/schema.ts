import {
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  integer,
  date,
  numeric,
  boolean,
  varchar,
} from "drizzle-orm/pg-core";
export const userAuthMethodEnum = pgEnum("user_auth_method", [
  "email",
  "google",
]);

export const users = pgTable("users", {
  serial: serial("serial").primaryKey(),
  id: uuid("id").defaultRandom().notNull().unique(),
  providerId: text("provider_id"),
  name: text("name").notNull(),
  username: text("username").unique(),
  email: text("email").notNull().unique(),
  password: text("password"),
  emailVerifiedAt: timestamp("email_verified_at"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().notNull(),
  authMethod: userAuthMethodEnum("auth_method").default("email"),
  emailVerified: boolean("email_verified").default(false).notNull(),
});

export const songs = pgTable("songs", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),

  title: varchar("title", { length: 255 }).notNull(),

  artist: varchar("artist", { length: 255 }),

  album: varchar("album", { length: 255 }),

  albumArtist: varchar("album_artist", {
    length: 255,
  }),

  duration: numeric("duration", {
    precision: 10,
    scale: 3,
    mode: "number",
  }),

  genre: text("genre"),

  year: integer("year"),

  bitrate: integer("bitrate"),

  sampleRate: integer("sample_rate"),

  codec: text("codec"),

  container: text("container"),
  playCount: integer("play_count").notNull().default(0),
  fileName: text("file_name").notNull(),

  fileSize: integer("file_size").notNull(),

  mimeType: text("mime_type").notNull(),

  audioPubId: text("audio_pub_id").notNull(),

  audioUrl: text("audio_url").notNull(),

  coverPubId: text("cover_pub_id"),

  coverUrl: text("cover_url"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),

  refreshToken: text("refresh_token").notNull().unique(),

  expiresAt: timestamp("expires_at").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const apiKeys = pgTable("api_keys", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull(),

  keyHash: text("key_hash").notNull().unique(),

  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),

  active: boolean("active").default(true).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  lastUsedAt: timestamp("last_used_at"),
});
