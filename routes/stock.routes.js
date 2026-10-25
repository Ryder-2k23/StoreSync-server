import express from "express";
import upload from "../middlewares/fileUpload.middleware.js";
import {createStock,retrieveStock, getStockById, updateStock, deleteStock, getStockByWarehouse, getStockByWarehouseOfCategory} from "../controllers/stock.controller.js"

const router = express.Router();

router.post("/createStock/", createStock);
router.get("/getAll/", retrieveStock);
router.get("/getAll_by/:stock_id", getStockById);
router.put("/stock_update/:stock_id", updateStock);
router.delete("/erase/:stock_id", deleteStock);
router.get("/getFrom/:warehouse_id", getStockByWarehouse);
router.get("/getBy/:cat_id/from/:warehouse_id", getStockByWarehouseOfCategory)


export default router;