import express from "express";
import upload from "../middlewares/fileUpload.middleware.js";
import { createPurchase,getAllPurchase,getPurchaseById,deletPurchase } from "../controllers/purchase.controller.js"


const router = express.Router();


router.post("/", createPurchase);
router.get("/", getAllPurchase);
router.get("/get/:purchase_id",getPurchaseById);
router.delete("/delete/:purchase_id",deletPurchase);


export default router;