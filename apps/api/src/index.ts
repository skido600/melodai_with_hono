import { Hono } from "hono";
import auth from "./routes/api/auth";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import musicRoute from "./routes/api/music_route";
import developerRoute from "./routes/api/doc";
const app = new Hono();

const allowedOrigins = [
  "http://localhost:4000",
  "https://melodai-cyan.vercel.app",
];
app.use(logger());
app.use(
  "*",
  cors({
    origin: (origin) => {
      if (!origin) return origin;
      if (allowedOrigins.includes(origin)) return origin;
      return "";
    },
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
console.log("GOOGLE CALLBACK:", GOOGLE_CALLBACK_URL);
console.log("FRONTEND URL:", env.FRONTEND_URL);
console.log("GOOGLE CLIENT ID:", env.GOOGLE_CLIENT_ID);
app.route("/auth", auth);

app.route("/music/v1", musicRoute);
app.route("/api/v1", developerRoute);

app.get("/health", (c) => {
  return c.json({
    success: true,
    message: "server is active 😍",
  });
});

app.onError((err, c) => {
  return c.json(
    {
      success: false,
      message: err.message,
      data: null,
    },
    400,
  );
});
export default app;
