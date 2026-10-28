import bcrypt from "bcryptjs";
import env from "dotenv";
import jwt from "jsonwebtoken";
import { sendSuccess, sendError } from "../utils/response.js";
import mongoose from "mongoose";


import Stock from "../models/stock.model.js";
import StockMovement from "../models/stock-movement.js";
import Product from "../models/products.model.js";
import Supplier from "../models/supplier.model.js";
import Warehouse from "../models/warehose.model.js";
import Category from "../models/categories.model.js";
import Purchase from "../models/purchase.model.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// export const createPurchase = async(req, res)=>{
//     try {
//         const { supplier, product, warehouse, category, qty_recieved, unit_purchase_cost } = req.body;
        
//         if(!supplier || !product || !warehouse || !category || !qty_recieved || !unit_purchase_cost){
//             return sendError(
//                 res,
//                 400,
//                 "Please provide all required fields"
//             );
//         };
        
//         const purchase = await Purchase.create({
//             supplier,
//             product,
//             warehouse,
//             category,
//             qty_recieved,
//             unit_purchase_cost
//         });

//         return sendSuccess(res,201,"Purchase recorded successfully", purchase);
//     } catch (error) {
//         console.error("Error creating Product: ", error);
        
//         return sendError(
//             res,
//             500,
//             "Failed to create product",
//             error.message
//         );
//     }
// }



export const createPurchase = async (req, res) => {
    try {
        const { supplier, warehouse, items } = req.body;

        // 1. Check required fields
        if (!supplier || !warehouse || !Array.isArray(items) || items.length === 0) {
            return sendError(
                res,
                400,
                "Please provide a supplier, warehouse, and at least one purchase item"
            );
        }

        // 2. Check that every item has valid details
        for (const item of items) {
            if (
                !item.product ||
                !Number.isInteger(item.quantity) ||
                item.quantity < 1 ||
                typeof item.unit_purchase_cost !== "number" ||
                !Number.isFinite(item.unit_purchase_cost) ||
                item.unit_purchase_cost < 0
            ) {
                return sendError(
                    res,
                    400,
                    "Each item must have a product, a positive whole-number quantity, and a valid purchase cost"
                );
            }
        }

        // 3. Check that the supplier and warehouse exist
        const [existingSupplier, existingWarehouse] = await Promise.all([
            Supplier.findById(supplier),
            Warehouse.findById(warehouse)
        ]);

        if (!existingSupplier) {
            return sendError(res, 404, "Supplier does not exist");
        }

        if (!existingWarehouse) {
            return sendError(res, 404, "Warehouse does not exist");
        }

        // 4. Check that every product exists
        const productIds = items.map(item => item.product);
        const existingProducts = await Product.find({
            _id: { $in: productIds }
        });

        if (existingProducts.length !== new Set(productIds.map(String)).size) {
            return sendError(
                res,
                404,
                "One or more products do not exist"
            );
        }

        // 5. Create the purchase
        const purchase = await Purchase.create({
            supplier,
            warehouse,
            items
        });

        return sendSuccess(
            res,
            201,
            "Purchase recorded successfully",
            purchase
        );

    } catch (error) {
        console.error("Error creating purchase:", error);

        return sendError(
            res,
            500,
            "Failed to create purchase",
            error.message
        );
    }
};

// export const getAllPurchase = async(req, res)=>{
//     try {
//         const purchase = await Purchase.find().sort({createdAt:-1})
//         .populate("warehouse", "ware_name ware_address ware_city ware_country")
//         .populate("product", "product_name unitPrice")
//         .populate("category", "cat_name")
//         .populate("supplier", "supplier_name agent_contact supplier_location")
        
//         return sendSuccess(res, 200, "Purchase recorded sucessfully!", purchase)
//     } catch (error) {
//         console.error("Error recording purchase: ", error);
        
//         return sendError(
//             res,
//             500,
//             "Failed to record purchase",
//             error.message
//         );
//     }
// }


export const getAllPurchase = async (req, res) => {
    try {
        const purchases = await Purchase.find()
            .sort({ createdAt: -1 })
            .populate("warehouse", "ware_name ware_address ware_city ware_country")
            .populate("supplier", "supplier_name agent_contact supplier_location")
            .populate("items.product", "product_name unitPrice category");

        return sendSuccess(
            res,
            200,
            "Purchases retrieved successfully",
            purchases
        );

    } catch (error) {
        console.error("Error retrieving purchases:", error);

        return sendError(
            res,
            500,
            "Failed to retrieve purchases",
            error.message
        );
    }
};
 


// export const getPurchaseById = async(req, res)=>{
//     try {
//         const { purchase_id } = req.params;

//         const purchase = await Purchase.findById(purchase_id)
//         .populate("warehouse", "ware_name ware_address ware_city ware_country")
//         .populate("product", "product_name unitPrice")
//         .populate("category", "cat_name")
//         .populate("supplier", "supplier_name agent_contact supplier_location")

//         if(!purchase){
//             return sendError(res, 404, "Purchase not found");
//         }
        
//         return sendSuccess(res, 200, "Purchase recorded successfully", purchase);
//     } catch (error) {
//         console.error("Error recording purchase: ", error);
        
//         return sendError(
//             res,
//             500,
//             "Failed to record purchase",
//             error.message
//         );
//     }
// }



export const getPurchaseById = async (req, res) => {
    try {
        const { purchase_id } = req.params;

        const purchase = await Purchase.findById(purchase_id)
            .populate("warehouse", "ware_name ware_address ware_city ware_country")
            .populate("supplier", "supplier_name agent_contact supplier_location")
            .populate("items.product", "product_name unitPrice category");

        if (!purchase) {
            return sendError(res, 404, "Purchase not found");
        }

        return sendSuccess(
            res,
            200,
            "Purchase retrieved successfully",
            purchase
        );

    } catch (error) {
        console.error("Error retrieving purchase:", error);

        return sendError(
            res,
            500,
            "Failed to retrieve purchase",
            error.message
        );
    }
};



// export const updatePurchase = async(req, res)=>{
//     try {
//         const { purchase_id } = req.params;
//         const updateData = {...req.body};

//         const purchase = await Purchase.findByIdAndUpdate(
//             purchase_id,
//             updateData,
//             { returnDocument: 'after', runValidators:true}
//         )

//         if(!purchase){
//             return sendError(
//                 res,
//                 404,
//                 "Purchase not found"
//             )
//         }

//         return sendSuccess(res, 201, "Purchase updated successfully", purchase);
//     } catch (error) {
//         console.error("Error updating purchase: ", error);
        
//         return sendError(
//             res,
//             500,
//             "Failed to update purchase",
//             error.message
//         );
//     }
// }



export const updatePurchase = async (req, res) => {
    try {
        const { purchase_id } = req.params;
        const { supplier, warehouse, items, status } = req.body;

        const purchase = await Purchase.findById(purchase_id);

        if (!purchase) {
            return sendError(res, 404, "Purchase not found");
        }

        // Prevent editing a purchase that has already been received
        if (purchase.status === "completed") {
            return sendError(
                res,
                400,
                "A completed purchase cannot be updated"
            );
        }

        // Update only the fields provided
        if (supplier !== undefined) {
            const existingSupplier = await Supplier.findById(supplier);

            if (!existingSupplier) {
                return sendError(res, 404, "Supplier does not exist");
            }

            purchase.supplier = supplier;
        }

        if (warehouse !== undefined) {
            const existingWarehouse = await Warehouse.findById(warehouse);

            if (!existingWarehouse) {
                return sendError(res, 404, "Warehouse does not exist");
            }

            purchase.warehouse = warehouse;
        }

        if (items !== undefined) {
            if (!Array.isArray(items) || items.length === 0) {
                return sendError(
                    res,
                    400,
                    "A purchase must contain at least one item"
                );
            }

            for (const item of items) {
                if (
                    !item.product ||
                    !Number.isInteger(item.quantity) ||
                    item.quantity < 1 ||
                    typeof item.unit_purchase_cost !== "number" ||
                    !Number.isFinite(item.unit_purchase_cost) ||
                    item.unit_purchase_cost < 0
                ) {
                    return sendError(
                        res,
                        400,
                        "Each item must have a product, a positive whole-number quantity, and a valid purchase cost"
                    );
                }
            }

            const productIds = items.map(item => item.product);
            const existingProducts = await Product.find({
                _id: { $in: productIds }
            });

            if (
                existingProducts.length !==
                new Set(productIds.map(String)).size
            ) {
                return sendError(
                    res,
                    404,
                    "One or more products do not exist"
                );
            }

            purchase.items = items;
        }

        // Allow status changes only to pending or failed here.
        // Receiving must happen through receivePurchase.
        if (status !== undefined) {
            if (!["pending", "failed"].includes(status)) {
                return sendError(
                    res,
                    400,
                    "Use the receiving endpoint to complete a purchase"
                );
            }

            purchase.status = status;
        }

        await purchase.save();

        return sendSuccess(
            res,
            200,
            "Purchase updated successfully",
            purchase
        );

    } catch (error) {
        console.error("Error updating purchase:", error);

        return sendError(
            res,
            500,
            "Failed to update purchase",
            error.message
        );
    }
};



export const deletPurchase = async(req, res)=>{
    try {
        const { purchase_id } = req.params;
        const purchase = await Purchase.findByIdAndDelete(purchase_id)

        if(!purchase){
            return sendError(res,
                404,
                "purchase not found"
            )
        }

        return sendSuccess(res, 201, "purchase record erased successfully");
    } catch (error) {
        console.error("Error deleting purchase: ", error);
        
        return sendError(
            res,
            500,
            "Failed to delete purchase",
            error.message
        );
    }
}

export const retrieve_purchaseOfAWarehouse = async(req, res)=>{
    try {
        const { warehouse_id } = req.params;
        
        const warehouse = await Warehouse.findById(warehouse_id);

        if(!warehouse){
            return sendError(res,404,"Warehouse not found");
        }

        const purchases = await Purchase.find({
            warehouse:warehouse._id
        })

        if(!purchases){
            return sendError(res, 404, "There is no purchases made yet here");
        }

        return sendSuccess(res,200,"Purchases retrieved successfully", purchases)
    } catch (error) {
        console.error("Error retrieving purchase: ", error);
        
        return sendError(
            res,
            500,
            "Failed to retrieve purchase",
            error.message
        );
    }
}



export const receivePurchase = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const { purchase_id } = req.params;
        let receivedPurchase;

        await session.withTransaction(async () => {
            const purchase = await Purchase.findById(purchase_id).session(session);

            if (!purchase) {
                throw new Error("PURCHASE_NOT_FOUND");
            }

            if (purchase.status !== "pending") {
                throw new Error("PURCHASE_NOT_PENDING");
            }

            for (const item of purchase.items) {
                const product = await Product.findById(item.product).session(session);

                if (!product) {
                    throw new Error("PRODUCT_NOT_FOUND");
                }

                if (!product.category) {
                    throw new Error("PRODUCT_CATEGORY_NOT_FOUND");
                }

                const categoryId = product.category._id ?? product.category;

                await Stock.findOneAndUpdate(
                    {
                        product: product._id,
                        warehouse: purchase.warehouse
                    },
                    {
                        $inc: { quantity: item.quantity },
                        $setOnInsert: { category: categoryId }
                    },
                    {
                        upsert: true,
                        new: true,
                        runValidators: true,
                        setDefaultsOnInsert: true,
                        session
                    }
                );

                await StockMovement.create(
                    [{
                        product: product._id,
                        warehouse: purchase.warehouse,
                        category: categoryId,
                        quantity_affected: item.quantity,
                        movementType: "stock-in",
                        reason: "goods received from purchase",
                        referenceType: "purchase",
                        referenceId: purchase._id
                    }],
                    { session }
                );
            }

            purchase.status = "completed";
            await purchase.save({ session });

            receivedPurchase = purchase;
        });

        return sendSuccess(
            res,
            200,
            "Purchase received and stock updated successfully",
            receivedPurchase
        );

    } catch (error) {
        console.error("Error receiving purchase:", error);

        if (error.message === "PURCHASE_NOT_FOUND") {
            return sendError(res, 404, "Purchase not found");
        }

        if (error.message === "PURCHASE_NOT_PENDING") {
            return sendError(
                res,
                400,
                "Only pending purchases can be received"
            );
        }

        if (error.message === "PRODUCT_NOT_FOUND") {
            return sendError(res, 404, "A product in this purchase was not found");
        }

        if (error.message === "PRODUCT_CATEGORY_NOT_FOUND") {
            return sendError(res, 400, "A product in this purchase has no category assigned");
        }

        return sendError(res, 500, "Failed to receive purchase", error.message);

    } finally {
        await session.endSession();
    }
};


// export const receivePurchase = async (req, res) => {
//     const session = await mongoose.startSession();

//     try {
//         const { purchase_id } = req.params;

//         let receivedPurchase;

//         await session.withTransaction(async () => {
//             // 1. Find the purchase
//             const purchase = await Purchase.findById(purchase_id)
//                 .session(session);

//             if (!purchase) {
//                 throw new Error("PURCHASE_NOT_FOUND");
//             }

//             // 2. Prevent receiving the same purchase twice
//             if (purchase.status === "completed") {
//                 throw new Error("PURCHASE_ALREADY_RECEIVED");
//             }

//             if (purchase.status !== "pending") {
//                 throw new Error("PURCHASE_NOT_PENDING");
//             }

//             // 3. Make sure the purchase arrays match
//             if (
//                 !purchase.product.length ||
//                 purchase.product.length !== purchase.qty_recieved.length ||
//                 purchase.product.length !== purchase.unit_purchase_cost.length
//             ) {
//                 throw new Error("INVALID_PURCHASE_ITEMS");
//             }

//             // 4. Process each product in the purchase
//             for (let i = 0; i < purchase.product.length; i++) {
//                 const productId = purchase.product[i];
//                 const quantity = purchase.qty_recieved[i];

//                 if (!Number.isInteger(quantity) || quantity < 1) {
//                     throw new Error("INVALID_PURCHASE_QUANTITY");
//                 }

//                 const product = await Product.findById(productId)
//                     .session(session);

//                 if (!product) {
//                     throw new Error("PRODUCT_NOT_FOUND");
//                 }

//                 // Increase stock for this product at the destination warehouse
//                 await Stock.findOneAndUpdate(
//                     {
//                         product: productId,
//                         warehouse: purchase.warehouse
//                     },
//                     {
//                         $inc: { quantity },
//                         $setOnInsert: { category: purchase.category }
//                     },
//                     {
//                         upsert: true,
//                         new: true,
//                         runValidators: true,
//                         setDefaultsOnInsert: true,
//                         session
//                     }
//                 );

//                 // Record the stock-in movement
//                 await StockMovement.create(
//                     [{
//                         product: productId,
//                         warehouse: purchase.warehouse,
//                         category: purchase.category,
//                         quantity_affected: quantity,
//                         movementType: "stock-in",
//                         reason: "goods received from purchase",
//                         referenceType: "purchase",
//                         referenceId: purchase._id
//                     }],
//                     { session }
//                 );
//             }

//             // 5. Mark the purchase as received
//             purchase.status = "completed";
//             await purchase.save({ session });

//             receivedPurchase = purchase;
//         });

//         return sendSuccess(
//             res,
//             200,
//             "Purchase received and stock updated successfully",
//             receivedPurchase
//         );

//     } catch (error) {
//         console.error("Error receiving purchase:", error);

//         const errors = {
//             PURCHASE_NOT_FOUND: [404, "Purchase not found"],
//             PURCHASE_ALREADY_RECEIVED: [400, "This purchase has already been received"],
//             PURCHASE_NOT_PENDING: [400, "Only pending purchases can be received"],
//             INVALID_PURCHASE_ITEMS: [400, "Purchase products, quantities, and costs must match"],
//             INVALID_PURCHASE_QUANTITY: [400, "Purchase quantities must be positive whole numbers"],
//             PRODUCT_NOT_FOUND: [404, "A product in this purchase does not exist"]
//         };

//         if (errors[error.message]) {
//             const [statusCode, message] = errors[error.message];
//             return sendError(res, statusCode, message);
//         }

//         return sendError(
//             res,
//             500,
//             "Failed to receive purchase",
//             error.message
//         );

//     } finally {
//         await session.endSession();
//     }
// };