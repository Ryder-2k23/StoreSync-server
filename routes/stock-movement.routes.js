import express from "express";
import upload from "../middlewares/fileUpload.middleware.js";
import { adjustStock,createStockMovements,getAllStockMovementsById,getAllStockMovementsOfAproduct, getAllStockMovementsFromAwarehouse, getAllStockMovements,deleteStockMovement } from "../controllers/stock-movement.controller.js"
import { staffAuthMiddleware, authorizeRoles } from "../middlewares/auth.middleware.js"


const router = express.Router();

router.get("/getAll/",staffAuthMiddleware, getAllStockMovements);
router.post("/create/",staffAuthMiddleware,authorizeRoles("storekeeper"), createStockMovements); 
router.get("/getBy/:movement_id",staffAuthMiddleware,getAllStockMovementsById);
router.get("/getOf/:product_id",staffAuthMiddleware,getAllStockMovementsOfAproduct); 
router.get("/getFrom/:warehouse_id",staffAuthMiddleware,getAllStockMovementsFromAwarehouse);
router.delete("/erase/:movement_id",staffAuthMiddleware,authorizeRoles("admin"), deleteStockMovement)
router.post("/adjust",staffAuthMiddleware,authorizeRoles("storekeeper"), adjustStock)

export default router;