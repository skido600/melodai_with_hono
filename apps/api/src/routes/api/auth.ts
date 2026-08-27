import { Hono } from "hono";
import { AuthController } from "../../services/auth";
import { requireAuth } from "../../middlewares/authMiddleware";

const auth = new Hono();
auth.post("/google/url", AuthController.googleUrl);

auth.get("/google/callback", AuthController.googleCallback);
auth.get("/me", requireAuth, AuthController.getMe);
auth.post("/logout", requireAuth, AuthController.logout);
export default auth;
