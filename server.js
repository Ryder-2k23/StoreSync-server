import express from "express";
import dotenv from 'dotenv';
import { connectDB } from "./config/db.js";
import cors from "cors"
import errorMiddleware from "./middlewares/error.middleware.js";

import productRoutes from "./routes/products.routes.js";
import categoryRoutes from "./routes/categories.routes.js";

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


connectDB()
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Server is running on PORT ${PORT}`)
);

