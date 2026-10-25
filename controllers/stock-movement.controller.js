import bcrypt from "bcryptjs";
import env from "dotenv";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { sendSuccess, sendError } from "../utils/response.js";

import StockMovement from "../models/stock-movement.js";
import Product from "../models/products.model.js"
import Warehouse from "../models/warehose.model.js";
import Stock from "../models/stock.model.js";
import Category from "../models/categories.model.js";

env.config();


export const getAllStockMovements = async (req, res) => {
    try {
        const movements = await StockMovement.find().sort({createdAt: -1})
        .populate("product", "product_image product_name unitPrice reorderThreshold inStock")
       .populate("category", "cat_name")
       .populate("warehouse", "ware_name ware_address")


        return sendSuccess(res, 200, "Stock movements retrieved successfully", movements);

    } catch (error) {
        console.error("Error retrieving movements: ", error);

        return sendError(res, 500, "Failed to retrieve stock movements", error.message);
    }
};


// export const createStockMovements = async (req, res) => {
//     try {
//         const { product, warehouse, category, quantity_affected, movementType, reason,referenceType } = req.body;

//          if(!product || !warehouse || !category || !quantity_affected || !movementType || !reason || !referenceType ) {
//                     return sendError(res, 400, " Please provide all required fields");
//         };


//         const movement = await StockMovement.create({
//                     product,
//                     warehouse,
//                     category,
//                     quantity_affected,
//                     movementType,
//                     reason,
//                     referenceType
//                 });

//         return sendSuccess(res, 200, "Stock movement created successfully", movement);

//     } catch (error) {
//         console.error("Error retrieving movements: ", error);

//         return sendError(res, 500, "Failed to retrieve stock movements", error.message);
//     }
// };


export const createStockMovements = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const { product, warehouse, category, quantity_affected, movementType, reason, referenceType, referenceId } = req.body;

        // 1. Validate required fields
        if ( !product || !warehouse || !category || quantity_affected === undefined || !movementType || !reason || !referenceType ) {
            return sendError(res, 400, "Please provide all required fields");
        }

        // 2. Validate quantity
        if (!Number.isInteger(quantity_affected) ||quantity_affected < 1) {
            return sendError(
                res,
                400,
                "Quantity affected must be a positive whole number"
            );
        }

        const validTypes = [
            "stock-in",
            "stock-out",
            "adjusted-in",
            "adjusted-out"
        ];

        if (!validTypes.includes(movementType)) {
            return sendError(res, 400, "Invalid movement type");
        }

        // 3. Confirm that the referenced records exist
        const [existingProduct, existingWarehouse, existingCategory] =
            await Promise.all([
                Product.findById(product),
                Warehouse.findById(warehouse),
                Category.findById(category)
            ]);

        if (!existingProduct) {
            return sendError(res, 404, "Product does not exist");
        }

        if (!existingWarehouse) {
            return sendError(res, 404, "Warehouse does not exist");
        }

        if (!existingCategory) {
            return sendError(res, 404, "Category does not exist");
        }

        // 4. Update stock and record the movement together
        let movement;

        await session.withTransaction(async () => {
            const isStockIn = [
                "stock-in",
                "adjusted-in"
            ].includes(movementType);

            let updatedStock;

            if (isStockIn) {
                // Add quantity, or create a stock record if none exists
                updatedStock = await Stock.findOneAndUpdate(
                    { product, warehouse },
                    {
                        $inc: { quantity: quantity_affected },
                        $setOnInsert: { category }
                    },
                    {
                        new: true,
                        upsert: true,
                        runValidators: true,
                        session,
                        setDefaultsOnInsert: true
                    }
                );
            } else {
                // Subtract quantity only if enough stock is available
                updatedStock = await Stock.findOneAndUpdate(
                    {
                        product,
                        warehouse,
                        quantity: { $gte: quantity_affected }
                    },
                    {
                        $inc: { quantity: -quantity_affected }
                    },
                    {
                        new: true,
                        runValidators: true,
                        session
                    }
                );

                if (!updatedStock) {
                    throw new Error("INSUFFICIENT_STOCK");
                }
            }

            // Save the audit record
            const createdMovements = await StockMovement.create(
                [{
                    product,
                    warehouse,
                    category,
                    quantity_affected,
                    movementType,
                    reason,
                    referenceType,
                    referenceId: referenceId || null
                }],
                { session }
            );

            movement = createdMovements[0];
        });

        return sendSuccess(
            res,
            201,
            "Stock movement created and stock quantity updated successfully",
            movement
        );

    } catch (error) {
        console.error("Error creating stock movement:", error);

        if (error.message === "INSUFFICIENT_STOCK") {
            return sendError(
                res,
                400,
                "Insufficient stock for this movement"
            );
        }

        return sendError(
            res,
            500,
            "Failed to create stock movement",
            error.message
        );

    } finally {
        await session.endSession();
    }
};


export const getAllStockMovementsById = async (req, res) => {
    try {
        const { movement_id } = req.params;
        const movement = await StockMovement.findById(movement_id)
        .populate("product", "product_image product_name unitPrice reorderThreshold inStock")
       .populate("category", "cat_name")
       .populate("warehouse", "ware_name ware_address")


         if(!movement){
            return sendError(res,400, "Movement not found");
        }

        return sendSuccess(res, 200, "Stock movements retrieved successfully", movement);

    } catch (error) {
        console.error("Error retrieving movement: ", error);

        return sendError(res, 500, "Failed to retrieve stock movement", error.message);
    }
};


export const getAllStockMovementsOfAproduct = async (req, res) => {
    try {
        const { product_id } = req.params;
        const product = await Product.findById(product_id)
        


         if(!product){
            return sendError(res, 404, "Product does not exist")
        }

        const movement= await StockMovement.find({
            product:product._id
        }).populate("product", "product_image product_name unitPrice reorderThreshold inStock")
       .populate("category", "cat_name")
       .populate("warehouse", "ware_name ware_address")


       if(!movement){
            return sendError(res, 404, "There is no stock movement")
        }

        return sendSuccess(res, 200, "Stock movements retrieved successfully", movement);

    } catch (error) {
        console.error("Error retrieving movement: ", error);

        return sendError(res, 500, "Failed to retrieve stock movement", error.message);
    }
};


export const getAllStockMovementsFromAwarehouse = async (req, res) => {
    try {
        const { warehouse_id } = req.params;
        const warehouse = await Warehouse.findById(warehouse_id)
        


         if(!warehouse){
            return sendError(res, 404, "Warehouse does not exist")
        }

        const movement= await StockMovement.find({
            warehouse:warehouse._id
        }).populate("product", "product_image product_name unitPrice reorderThreshold inStock")
       .populate("category", "cat_name")
       .populate("warehouse", "ware_name ware_address")


       if(!movement){
            return sendError(res, 404, "There is no stock movement")
        }

        return sendSuccess(res, 200, "Stock movements retrieved successfully", movement);

    } catch (error) {
        console.error("Error retrieving movement: ", error);

        return sendError(res, 500, "Failed to retrieve stock movement", error.message);
    }
};