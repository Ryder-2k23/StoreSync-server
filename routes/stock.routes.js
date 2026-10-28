import express from "express";
import upload from "../middlewares/fileUpload.middleware.js";
import {createStock,retrieveStock, getStockById, updateStock, deleteStock, getStockByWarehouse, getStockByWarehouseOfCategory} from "../controllers/stock.controller.js"
import { staffAuthMiddleware, authorizeRoles } from "../middlewares/auth.middleware.js"

const router = express.Router();

router.post("/createStock/",staffAuthMiddleware,authorizeRoles("storekeeper"), createStock);
router.get("/getAll/",staffAuthMiddleware, retrieveStock);
router.get("/getAll_by/:stock_id",staffAuthMiddleware, getStockById);
router.put("/stock_update/:stock_id",staffAuthMiddleware,authorizeRoles("storekeeper"), updateStock);
router.delete("/erase/:stock_id",staffAuthMiddleware,authorizeRoles("admin"), deleteStock);
router.get("/getFrom/:warehouse_id",staffAuthMiddleware, getStockByWarehouse);
router.get("/getBy/:cat_id/from/:warehouse_id",staffAuthMiddleware, getStockByWarehouseOfCategory)


export default router;