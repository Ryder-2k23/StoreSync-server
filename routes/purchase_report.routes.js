import express from "express";
import { getPurchaseReport } from "../controllers/purchase_report.controller.js"
import { staffAuthMiddleware, authorizeRoles } from "../middlewares/auth.middleware.js"

const router = express.Router();

router.get("/", getPurchaseReport, staffAuthMiddleware, authorizeRoles("admin", "manager", "storekeeper"));


export default router;