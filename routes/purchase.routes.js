import express from "express";
import upload from "../middlewares/fileUpload.middleware.js";
import { createPurchase,getAllPurchase,receivePurchase,getPurchaseById,deletPurchase,retrieve_purchaseOfAWarehouse } from "../controllers/purchase.controller.js"
import { staffAuthMiddleware, authorizeRoles } from "../middlewares/auth.middleware.js"

const router = express.Router();


router.post("/", createPurchase,staffAuthMiddleware, authorizeRoles("manger"));
router.get("/", getAllPurchase, staffAuthMiddleware, authorizeRoles("manger"));
router.get("/get/:purchase_id",getPurchaseById, staffAuthMiddleware, authorizeRoles("manger"));
router.get("/get/purchases_from/:warehouse_id",retrieve_purchaseOfAWarehouse, staffAuthMiddleware, authorizeRoles("manger"))
router.delete("/delete/:purchase_id",deletPurchase,staffAuthMiddleware,authorizeRoles("manger"));
router.patch("/:purchase_id/recieve", receivePurchase,staffAuthMiddleware,authorizeRoles("admin"))


export default router;