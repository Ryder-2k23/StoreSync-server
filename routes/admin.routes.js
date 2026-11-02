import express from "express";
import { registerAdmin,loginAdmin,getAllStaffs,getSingleStaff,updateAdminProfile,deleteStaff,changeStaffRole } from "../controllers/admin.controller.js"
import upload from "../middlewares/fileUpload.middleware.js";
import { staffAuthMiddleware, authorizeRoles, adminAuthMiddleware } from "../middlewares/auth.middleware.js"

const router = express.Router();

router.post("/", registerAdmin);
router.post("/login", loginAdmin);
router.get("/",adminAuthMiddleware,authorizeRoles("admin"), getAllStaffs);
router.get("/:staff_id",adminAuthMiddleware,authorizeRoles("admin"), getSingleStaff);
router.put("/update/:admin_id",upload.single("avatar"),adminAuthMiddleware, authorizeRoles("admin"),  updateAdminProfile);
router.delete("/delete/:staff_id",adminAuthMiddleware,authorizeRoles("admin"), deleteStaff);
router.put("/change_role/:staff_id",adminAuthMiddleware,authorizeRoles("admin"), changeStaffRole);

export default router;
