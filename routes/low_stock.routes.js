import express from "express";
import { getLowStock } from "../controllers/lowStoct.controller.js"
import { staffAuthMiddleware, authorizeRoles } from "../middlewares/auth.middleware.js"

const router = express.Router();

router.get("/getAll/",staffAuthMiddleware, getLowStock); 


export default router;