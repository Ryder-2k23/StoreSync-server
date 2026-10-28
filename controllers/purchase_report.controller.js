import bcrypt from "bcryptjs";
import env from "dotenv";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";


import { sendSuccess, sendError } from "../utils/response.js";
import Purchase from "../models/purchase.model.js";


export const getPurchaseReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (startDate && isNaN(Date.parse(startDate))) {
      return sendError(res, 400, "Invalid start date format");
    }
    
    if (endDate && isNaN(Date.parse(endDate))) {
      return sendError(res, 400, "Invalid end date format");
    }
    
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return sendError(
        res,
        400,
        "Start date cannot be later than end date"
      );
    }

    const filter = { status: "completed" };

    if (startDate || endDate) {
      filter.createdAt = {};

      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    const purchases = await Purchase.find(filter)
      .populate("supplier")
      .populate("warehouse")
      .populate("items.product")
      .sort({ createdAt: -1 });

    const totalPurchaseCost = purchases.reduce((total, purchase) => {
      return total + purchase.total_cost;
    }, 0);

    const totalPurchases = purchases.length;

    const report = {
      totalPurchaseCost,
      totalPurchases,
      purchases
    };

    return sendSuccess(
      res,
      200,
      "Purchase report retrieved successfully",
      report
    );
  } catch (error) {
    console.error("Error generating purchase report:", error);

    return sendError(
      res,
      500,
      "Failed to generate purchase report",
      error.message
    );
  }
};
