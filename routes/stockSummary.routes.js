import express from "express";
import { getStockSummary } from "../controllers/stockSummary.controller.js"
import { staffAuthMiddleware,adminAuthMiddleware, authorizeRoles } from "../middlewares/auth.middleware.js"

const router = express.Router();

router.get("/summary/",adminAuthMiddleware, authorizeRoles("admin"), getStockSummary);


export default router;
