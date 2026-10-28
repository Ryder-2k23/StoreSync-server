import express from "express";
import { registerAdmin,loginAdmin,getAllStaffs,getSingleStaff,updateAdminProfile,deleteStaff,changeStaffRole } from "../controllers/admin.controller.js"
import upload from "../middlewares/fileUpload.middleware.js";
import { staffAuthMiddleware, authorizeRoles } from "../middlewares/auth.middleware.js"

const router = express.Router();

router.post("/", registerAdmin);
router.post("/login", loginAdmin);
router.get("/",staffAuthMiddleware,authorizeRoles("admin"), getAllStaffs);
router.get("/:staff_id",staffAuthMiddleware,authorizeRoles("admin"), getSingleStaff);
router.put("/update/:admin_id",upload.single("avatar"),staffAuthMiddleware, authorizeRoles("admin"),  updateAdminProfile);
router.delete("/delete/:staff_id",staffAuthMiddleware,authorizeRoles("admin"), deleteStaff);
router.put("/change_role/:staff_id",staffAuthMiddleware,authorizeRoles("admin"), changeStaffRole);

export default router;