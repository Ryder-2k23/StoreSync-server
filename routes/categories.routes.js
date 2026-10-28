import express from "express";
import upload from "../middlewares/fileUpload.middleware.js";
import { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } from "../controllers/categories.controller.js";
import { staffAuthMiddleware, authorizeRoles } from "../middlewares/auth.middleware.js"

const router = express.Router();

router.post("/create", upload.array("cat_img"),staffAuthMiddleware,authorizeRoles("storekeeper"), createCategory);
router.get("/", getAllCategories);
router.get("/:cat_id", getCategoryById);
router.put("/update/:cat_id", upload.array("cat_img", 5),staffAuthMiddleware,authorizeRoles("storekeeper"), updateCategory);
router.delete("/delete/:cat_id",staffAuthMiddleware,authorizeRoles("storekeeper"), deleteCategory);



export default router;