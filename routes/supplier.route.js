import express from "express";
import { createSupplier,getAllSuppliers,getSupplierById ,updateSupplier,deleteSupplier } from "../controllers/supplier.controller.js";
import { staffAuthMiddleware, authorizeRoles } from "../middlewares/auth.middleware.js"

const router = express.Router();


router.post("/create",staffAuthMiddleware,authorizeRoles("manager", "admin"),  createSupplier);
router.get("/", getAllSuppliers);
router.get("/:sup_id", getSupplierById);
router.put("/update/:sup_id",staffAuthMiddleware,authorizeRoles("manager", "admin"), updateSupplier);
router.delete("/delete/:sup_id",staffAuthMiddleware,authorizeRoles("admin"), deleteSupplier);

export default router;