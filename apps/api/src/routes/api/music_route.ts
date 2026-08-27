import { Hono } from "hono";

import { requireAuth } from "../../middlewares/authMiddleware";
import { getMusicSignature } from "../../services/signature";
import {
  completeMusicUpload,
  getAllMusic,
  getMyMusic,
  getRecentMusic,
  playMusic,
  getTopMusic,
  deleteMusic,
} from "../../services/completeUpload";
const musicRoute = new Hono();
musicRoute.get("/upload-signature", requireAuth, getMusicSignature);
musicRoute.post("/complete", requireAuth, completeMusicUpload);
musicRoute.get("/all", requireAuth, getAllMusic);
musicRoute.get("/my", requireAuth, getMyMusic);
musicRoute.get("/recent", requireAuth, getRecentMusic);
musicRoute.post("/:id/play", requireAuth, playMusic);
musicRoute.get("/top", requireAuth, getTopMusic);
musicRoute.delete("/:id", requireAuth, deleteMusic);

export default musicRoute;
