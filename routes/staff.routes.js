import express from "express";
import { registerStaff, getAllStaffs, loginStaff, getSingleStaff,updateStaff, deleteStaff } from "../controllers/staff.controller.js"
import upload from "../middlewares/fileUpload.middleware.js";
import { staffAuthMiddleware, authorizeRoles } from "../middlewares/auth.middleware.js"
const router = express.Router();

router.post("/", registerStaff);
router.get("/",staffAuthMiddleware, getAllStaffs);
router.post("/login", loginStaff);
router.get("/employee/:staff_id", staffAuthMiddleware, getSingleStaff);
router.put("/update/:staff_id",upload.single("avatar"),staffAuthMiddleware, authorizeRoles("staff"), updateStaff);
router.delete("/delete/:staff_id",staffAuthMiddleware, authorizeRoles("admin"), deleteStaff);

export default router;