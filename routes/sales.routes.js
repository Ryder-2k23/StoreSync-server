import express from "express";
import { createSale,getAllSales,getSaleById,getSalesByWarehouse } from "../controllers/sales.controller.js"
import { staffAuthMiddleware, authorizeRoles } from "../middlewares/auth.middleware.js"

const router = express.Router();

router.post("/",staffAuthMiddleware,authorizeRoles("manager"), createSale);
router.get("/getAll/",staffAuthMiddleware, authorizeRoles("manager"), getAllSales);
router.get("/getAll/:sale_id",staffAuthMiddleware, authorizeRoles("manager"), getSaleById)
router.get("/getFrom/:warehouse_id",staffAuthMiddleware, authorizeRoles("manager"), getSalesByWarehouse)

export default router;