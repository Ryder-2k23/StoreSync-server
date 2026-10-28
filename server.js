import express from "express";
import dotenv from 'dotenv';
import { connectDB } from "./config/db.js";
import cors from "cors"
import errorMiddleware from "./middlewares/error.middleware.js";

import productRoutes from "./routes/products.routes.js";
import categoryRoutes from "./routes/categories.routes.js";
import supplierRoutes from "./routes/supplier.route.js";
import warehouseRoutes from "./routes/warehouse.route.js";
import purchaseRoutes from "./routes/purchase.routes.js";
import stockRoutes from "./routes/stock.routes.js";
import StockMovementRoutes from "./routes/stock-movement.routes.js";
import saleRoutes from "./routes/sales.routes.js"
import lowStock from "./routes/low_stock.routes.js"
import stockSummary from "./routes/stockSummary.routes.js";
import purchase_report from  "./routes/purchase_report.routes.js";
import sale_report from  "./routes/sale_report.route.js";
import staffRoute from "./routes/staff.routes.js";
import adminRoute from "./routes/admin.routes.js"

dotenv.config()

const app = express();

app.use(cors({origin: "http://localhost:6000"}));
// app.use(cors({
//     origin: [
//         "http://localhost:5173",
//         "https://medium-clone-fullstack.vercel.app"
//     ],
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"]
// }));
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(errorMiddleware)



//routes
app.use("/StoreSync/products", productRoutes);
app.use("/StoreSync/categories", categoryRoutes);
app.use("/StoreSync/suppliers", supplierRoutes);
app.use("/StoreSync/warehouses", warehouseRoutes);
app.use("/StoreSync/purchases", purchaseRoutes);
app.use("/StoreSync/stocks", stockRoutes);
app.use("/StoreSync/stock_movements", StockMovementRoutes);
app.use("/StoreSync/sales", saleRoutes );
app.use("/StoreSync/lowStock", lowStock );
app.use("/StoreSync/stockSummary", stockSummary );
app.use("/StoreSync/purchase_report", purchase_report);
app.use("/StoreSync/sale_report", sale_report);
app.use("/StoreSync/staff", staffRoute);
app.use("/StoreSync/admin", adminRoute)


connectDB()
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Server is running on PORT ${PORT}`)
);

