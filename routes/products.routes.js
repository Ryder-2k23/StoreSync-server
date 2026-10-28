import express from "express";
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, getProductsByCategory } from "../controllers/products.controller.js";
import upload from "../middlewares/fileUpload.middleware.js";
import { staffAuthMiddleware, authorizeRoles } from "../middlewares/auth.middleware.js"

const router = express.Router();


router.post("/", upload.array("product_img", 5), staffAuthMiddleware,authorizeRoles("manager"),createProduct);
router.get("/", getAllProducts);
router.get("/:product_id", getProductById);
router.get("/:cat_id/category", getProductsByCategory);
router.put("/update/:product_id",upload.array("product_img", 5),staffAuthMiddleware,authorizeRoles("admin", "manager"),  updateProduct);
router.delete("/delete/:product_id",staffAuthMiddleware,authorizeRoles("admin", "manager"), deleteProduct);


export default router;