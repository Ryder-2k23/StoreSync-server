import express from "express";
import upload from "../middlewares/fileUpload.middleware.js";
import { createStockMovements,getAllStockMovementsById,getAllStockMovementsOfAproduct, getAllStockMovementsFromAwarehouse, getAllStockMovements } from "../controllers/stock-movement.controller.js"


const router = express.Router();

router.get("/getAll/", getAllStockMovements);
router.post("/create/",createStockMovements); 
router.get("/getBy/:movement_id",getAllStockMovementsById);
router.get("/getOf/:product_id",getAllStockMovementsOfAproduct); 
router.get("/getFrom/:warehouse_id",getAllStockMovementsFromAwarehouse);

export default router;