
import mongoose from "mongoose";
import { sendSuccess, sendError } from "../utils/response.js";
import Sale from "../models/sales.model.js";
import Product from "../models/products.model.js";
import Warehouse from "../models/warehose.model.js";
import Stock from "../models/stock.model.js";
import StockMovement from "../models/stock-movement.js";


export const createSale = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const { warehouse, items } = req.body;

        if (!warehouse || !Array.isArray(items) || items.length === 0) {
            return sendError(
                res,
                400,
                "Please provide a warehouse and at least one sale item"
            );
        }

        for (const item of items) {
            if (
                !item.product ||
                !Number.isInteger(item.quantity) ||
                item.quantity < 1 ||
                typeof item.unit_selling_price !== "number" ||
                !Number.isFinite(item.unit_selling_price) ||
                item.unit_selling_price < 0
            ) {
                return sendError(
                    res,
                    400,
                    "Each item must have a product, a positive whole-number quantity, and a valid selling price"
                );
            }
        }

        let createdSale;

        await session.withTransaction(async () => {
            const existingWarehouse = await Warehouse.findById(warehouse)
                .session(session);

            if (!existingWarehouse) {
                throw new Error("Warehouse is not found");
            }

            const productIds = items.map(item => item.product);

            const existingProducts = await Product.find({
                _id: { $in: productIds }
            }).session(session);

            if (
                existingProducts.length !==
                new Set(productIds.map(String)).size
            ) {
                throw new Error("PRODUCT_NOT_FOUND");
            }

            for (const item of items) {
                const product = existingProducts.find(
                    p => p._id.toString() === item.product.toString()
                );

                if (!product.category) {
                    throw new Error("PRODUCT_CATEGORY_NOT_FOUND");
                }
            }

            const [sale] = await Sale.create(
                [{
                    warehouse,
                    items,
                    status: "completed"
                }],
                { session }
            );

            for (const item of items) {
                const product = existingProducts.find(
                    p => p._id.toString() === item.product.toString()
                );

                const categoryId = product.category._id ?? product.category;

                const updatedStock = await Stock.findOneAndUpdate(
                    {
                        product: item.product,
                        warehouse,
                        quantity: { $gte: item.quantity }
                    },
                    {
                        $inc: { quantity: -item.quantity }
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

                await StockMovement.create(
                    [{
                        product: item.product,
                        warehouse,
                        category: categoryId,
                        quantity_affected: item.quantity,
                        movementType: "stock-out",
                        reason: "goods sold",
                        referenceType: "sale",
                        referenceId: sale._id
                    }],
                    { session }
                );
            }

            createdSale = sale;
        });

        return sendSuccess(
            res,
            201,
            "Sale recorded and stock updated successfully",
            createdSale
        );

    } catch (error) {
        console.error("Error creating sale:", error);

        if (error.message === "WAREHOUSE_NOT_FOUND") {
            return sendError(res, 404, "Warehouse does not exist");
        }

        if (error.message === "PRODUCT_NOT_FOUND") {
            return sendError(res, 404, "One or more products do not exist");
        }

        if (error.message === "PRODUCT_CATEGORY_NOT_FOUND") {
            return sendError(res, 400, "A product has no category assigned");
        }

        if (error.message === "INSUFFICIENT_STOCK") {
            return sendError(
                res,
                400,
                "Insufficient stock for one or more products in this warehouse"
            );
        }

        return sendError(res, 500, "Failed to create sale", error.message);

    } finally {
        await session.endSession();
    }
};


export const getAllSales = async (req, res) => {
    try {
        const sales = await Sale.find()
            .sort({ createdAt: -1 })
            .populate("warehouse", "ware_name ware_address ware_city ware_country")
            .populate("items.product", "product_name unitPrice category");

        return sendSuccess(
            res,
            200,
            "Sales retrieved successfully",
            sales
        );

    } catch (error) {
        console.error("Error retrieving sales:", error);

        return sendError(
            res,
            500,
            "Failed to retrieve sales",
            error.message
        );
    }
};



export const getSaleById = async (req, res) => {
    try {
        const { sale_id } = req.params;

        if (!mongoose.isValidObjectId(sale_id)) {
            return sendError(res, 400, "Invalid sale ID");
        }

        const sale = await Sale.findById(sale_id)
            .populate(
                "warehouse",
                "ware_name ware_address ware_city ware_country"
            )
            .populate(
                "items.product",
                "product_name unitPrice category"
            );

        if (!sale) {
            return sendError(res, 404, "Sale not found");
        }

        return sendSuccess(
            res,
            200,
            "Sale retrieved successfully",
            sale
        );

    } catch (error) {
        console.error("Error retrieving sale:", error);

        return sendError(
            res,
            500,
            "Failed to retrieve sale",
            error.message
        );
    }
};



export const getSalesByWarehouse = async (req, res) => {
    try {
        const { warehouse_id } = req.params;

        if (!mongoose.isValidObjectId(warehouse_id)) {
            return sendError(res, 400, "Invalid warehouse ID");
        }

        const warehouse = await Warehouse.findById(warehouse_id);

        if (!warehouse) {
            return sendError(res, 404, "Warehouse not found");
        }

        const sales = await Sale.find({
            warehouse: warehouse_id
        })
            .sort({ createdAt: -1 })
            .populate(
                "warehouse",
                "ware_name ware_address ware_city ware_country"
            )
            .populate(
                "items.product",
                "product_name unitPrice category"
            );

        return sendSuccess(
            res,
            200,
            "Warehouse sales retrieved successfully",
            sales
        );

    } catch (error) {
        console.error("Error retrieving warehouse sales:", error);

        return sendError(
            res,
            500,
            "Failed to retrieve warehouse sales",
            error.message
        );
    }
};
