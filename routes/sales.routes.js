import express from "express";
import { createSale,getAllSales,getSaleById,getSalesByWarehouse } from "../controllers/sales.controller.js"
import { staffAuthMiddleware, authorizeRoles } from "../middlewares/auth.middleware.js"

const router = express.Router();

router.post("/",staffAuthMiddleware,authorizeRoles("manager"), createSale);
router.get("/getAll/",staffAuthMiddleware, getAllSales);
router.get("/getAll/:sale_id",staffAuthMiddleware, getSaleById)
router.get("/getFrom/:warehouse_id",staffAuthMiddleware, getSalesByWarehouse)

export default router;