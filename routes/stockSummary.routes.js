import express from "express";
import { getStockSummary } from "../controllers/stockSummary.controller.js"
import { staffAuthMiddleware, authorizeRoles } from "../middlewares/auth.middleware.js"

const router = express.Router();

router.get("/summary/",staffAuthMiddleware, authorizeRoles("admin"), getStockSummary);


export default router;
