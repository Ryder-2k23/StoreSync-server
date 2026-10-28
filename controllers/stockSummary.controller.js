import bcrypt from "bcryptjs";
import env from "dotenv";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";





import { sendSuccess, sendError } from "../utils/response.js";
import Stock from "../models/stock.model.js";

export const getStockSummary = async (req, res) => {
    try {
        const stocks = await Stock.find()
            .populate(
                "product",
                "product_name product_image unitPrice reorderThreshold"
            )
            .populate(
                "warehouse",
                "ware_name ware_address ware_city ware_country"
            );

        const summary = {};

        for (const stock of stocks) {
            if (!stock.product || !stock.warehouse) {
                continue;
            }

            const productId = stock.product._id.toString();
            const warehouseId = stock.warehouse._id.toString();

            if (!summary[productId]) {
                summary[productId] = {
                    product: stock.product,
                    totalQuantity: 0,
                    warehouses: []
                };
            }

            summary[productId].totalQuantity += stock.quantity;

            summary[productId].warehouses.push({
                warehouse: stock.warehouse,
                quantity: stock.quantity
            });
        }

        return sendSuccess(
            res,
            200,
            "Stock summary retrieved successfully",
            Object.values(summary)
        );

    } catch (error) {
        console.error("Error retrieving stock summary:", error);

        return sendError(
            res,
            500,
            "Failed to retrieve stock summary",
            error.message
        );
    }
};
