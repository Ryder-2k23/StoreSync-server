import express from "express";
import upload from "../middlewares/fileUpload.middleware.js";
import { createPurchase,getAllPurchase,getPurchaseById,deletPurchase,retrieve_purchaseOfAWarehouse } from "../controllers/purchase.controller.js"


const router = express.Router();


router.post("/", createPurchase);
router.get("/", getAllPurchase);
router.get("/get/:purchase_id",getPurchaseById);
router.get("/get/purchases_from/:warehouse_id",retrieve_purchaseOfAWarehouse)
router.delete("/delete/:purchase_id",deletPurchase);


export default router;