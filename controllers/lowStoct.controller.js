import bcrypt from "bcryptjs";
import env from "dotenv";
import jwt from "jsonwebtoken";
import { sendSuccess, sendError } from "../utils/response.js";
import Stock from "../models/stock.model.js";
env.config();



export const getLowStock = async (req, res) => {
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

        const lowStockItems = stocks.filter(stock => {
            if (!stock.product || !stock.warehouse) {
                return false;
            }

            return stock.quantity <= stock.product.reorderThreshold;
        });

        return sendSuccess(
            res,
            200,
            "Low-stock items retrieved successfully",
            lowStockItems
        );

    } catch (error) {
        console.error("Error retrieving low-stock items:", error);

        return sendError(
            res,
            500,
            "Failed to retrieve low-stock items",
            error.message
        );
    }
};
