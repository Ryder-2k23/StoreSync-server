import express from "express";
import upload from "../middlewares/fileUpload.middleware.js";
import { createWarehouse,getAllWarehouses,getWarehouseById,updateWarehouse,deleteWarehouse } from "../controllers/warehouse.controller.js"


const router = express.Router();


router.post("/create", upload.array("warehouse_img",5), createWarehouse);
router.get("/", getAllWarehouses);
router.get("/:warehouse_id",getWarehouseById);
router.put("/update/:warehouse_id",upload.array("warehouse_img",5), updateWarehouse);
router.delete("/delete/:warehouse_id",deleteWarehouse)


export default router;