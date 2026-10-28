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

export const deleteStockMovement = async(req, res)=>{
    try {
        const { movement_id } = req.params
        const movement = await StockMovement.findByIdAndDelete(movement_id);
        if(!movement){
            return sendError(
                res,
                404,
                "Movement not found"
            )
        };
        return sendSuccess(res, 200, "Movement successfullly erased");
    } catch (error) {
        console.error("Delete movement error: ", error);
        return sendError(
            res,
            500,
            "Error deleting movement",
            error.message
        )
    }
}



export const adjustStock = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const { product, warehouse, category, actualQuantity, reason } = req.body;

        // Validate required fields
        if ( !product || !warehouse || !category || actualQuantity === undefined || !reason ) {
            return sendError(
                res,
                400,
                "Please provide product, warehouse, category, actual quantity, and reason"
            );
        }

        // Validate the actual physical count
        if (!Number.isInteger(actualQuantity) ||actualQuantity < 0) {
            return sendError(
                res,
                400,
                "Actual quantity must be a non-negative whole number"
            );
        }

        if (typeof reason !== "string" || !reason.trim()) {
            return sendError(res, 400, "Please provide a valid reason");
        }

        // Check referenced records
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

        let result;

        await session.withTransaction(async () => {
            // Find the current stock record
            const currentStock = await Stock.findOne({
                product,
                warehouse
            }).session(session);

            if (!currentStock) {
                throw new Error("STOCK_RECORD_NOT_FOUND");
            }

            const currentQuantity = currentStock.quantity;
            const difference = actualQuantity - currentQuantity;

            // No adjustment is needed
            if (difference === 0) {
                result = {
                    adjusted: false,
                    currentQuantity,
                    actualQuantity,
                    difference: 0,
                    movement: null
                };
                return;
            }

            const movementType =
                difference > 0 ? "adjusted-in" : "adjusted-out";

            // Update the stock quantity
            const updatedStock = await Stock.findOneAndUpdate(
                {
                    _id: currentStock._id,
                    quantity: currentQuantity
                },
                {
                    $set: {
                        quantity: actualQuantity,
                        category
                    }
                },
                {
                    new: true,
                    runValidators: true,
                    session
                }
            );

            if (!updatedStock) {
                throw new Error("STOCK_CHANGED_RETRY");
            }

            // Record the adjustment for auditing
            const createdMovements = await StockMovement.create(
                [{
                    product,
                    warehouse,
                    category,
                    quantity_affected: Math.abs(difference),
                    movementType,
                    reason: reason.trim(),
                    referenceType: "adjustment",
                    referenceId: null
                }],
                { session }
            );

            result = {
                adjusted: true,
                previousQuantity: currentQuantity,
                actualQuantity,
                difference,
                stock: updatedStock,
                movement: createdMovements[0]
            };
        });

        if (!result.adjusted) {
            return sendSuccess(
                res,
                200,
                "Stock already matches the physical count; no adjustment was needed",
                result
            );
        }

        return sendSuccess(
            res,
            200,
            "Stock adjusted successfully",
            result
        );

    } catch (error) {
        console.error("Error adjusting stock:", error);

        if (error.message === "STOCK_RECORD_NOT_FOUND") {
            return sendError(
                res,
                404,
                "Stock record not found for this product and warehouse"
            );
        }

        if (error.message === "STOCK_CHANGED_RETRY") {
            return sendError(
                res,
                409,
                "Stock changed during adjustment. Please retry"
            );
        }

        return sendError(
            res,
            500,
            "Failed to adjust stock",
            error.message
        );

    } finally {
        await session.endSession();
    }
};
