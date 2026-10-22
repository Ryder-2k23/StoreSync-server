import express from "express";
import { createSupplier,getAllSuppliers,getSupplierById ,updateSupplier,deleteSupplier } from "../controllers/supplier.controller.js";

const router = express.Router();


router.post("/create", createSupplier);
router.get("/", getAllSuppliers);
router.get("/:sup_id", getSupplierById);
router.put("/update/:sup_id", updateSupplier);
router.delete("/delete/:sup_id", deleteSupplier);

export default router;