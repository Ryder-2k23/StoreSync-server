import express from "express";
import upload from "../middlewares/fileUpload.middleware.js";
import { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } from "../controllers/categories.controller.js";

const router = express.Router();

router.post("/create", upload.single("category_img"), createCategory);
router.get("/", getAllCategories);
router.get("/:cat_id", getCategoryById);
router.put("/update/:cat_id", upload.array("cat_img", 5), updateCategory);
router.delete("/delete/:cat_id", deleteCategory);



export default router;