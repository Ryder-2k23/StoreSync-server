import express from "express";
import { getSalesReport } from "../controllers/sales_reports.controller.js"
import { staffAuthMiddleware, authorizeRoles } from "../middlewares/auth.middleware.js"

const router = express.Router();

router.get("/", getSalesReport, staffAuthMiddleware, authorizeRoles("admin", "manager", "storekeeper"));


export default router;