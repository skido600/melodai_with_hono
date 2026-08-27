import { requireAuth } from "../../middlewares/authMiddleware";
import { requireApiKey } from "../../middlewares/requireApiKey";
import { getDeveloperMusic, getTopMusic } from "../../services/completeUpload";
import { deleteApiKey, generateApiKey, getMyApiKeys } from "../../services/doc";
import { Hono } from "hono";

const developerRoute = new Hono();

developerRoute.post("/api-key", requireAuth, generateApiKey);
developerRoute.get("/top", getTopMusic);
developerRoute.get("/key", requireAuth, getMyApiKeys);
developerRoute.get("/music", requireApiKey, getDeveloperMusic);
developerRoute.delete("/key/:id", requireAuth, deleteApiKey);
export default developerRoute;
