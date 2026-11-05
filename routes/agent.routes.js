import express from "express";
import { registerAgent, getAgents, getSingleAgent, updatAgent,deleteAgent} from "../controllers/agent.controller.js"
import upload from "../middlewares/fileUpload.middleware.js";
import { staffAuthMiddleware, authorizeRoles } from "../middlewares/auth.middleware.js"
const router = express.Router();

router.post("/", registerAgent);
router.get("/",staffAuthMiddleware,authorizeRoles("manager"), getAgents);
router.get("/:agent_id", staffAuthMiddleware, authorizeRoles("manager"), getSingleAgent);
router.put("/update/:agent_id",upload.single("avatar"),staffAuthMiddleware, authorizeRoles("manager"), updatAgent);
router.delete("/delete/:agent_id",staffAuthMiddleware, authorizeRoles("manager"), deleteAgent);

export default router;