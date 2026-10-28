import bcrypt from "bcryptjs";
import env from "dotenv";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import { sendSuccess, sendError } from "../utils/response.js";
import Sale from "../models/sales.model.js";


// export const getSalesReport = async (req, res) => {
//   try {
//     const sales = await Sale.find({ status: "completed" })
//       .populate("warehouse")
//       .populate("items.product")
//       .sort({ createdAt: -1 });

//     const totalSalesRevenue = sales.reduce((total, sale) => {
//       return total + sale.total_amount;
//     }, 0);

//     const totalSales = sales.length;

//     const report = {
//       totalSalesRevenue,
//       totalSales,
//       sales
//     };

//     return sendSuccess(
//       res,
//       200,
//       "Sales report retrieved successfully",
//       report
//     );
//   } catch (error) {
//     console.error("Error generating sales report:", error);

//     return sendError(
//       res,
//       500,
//       "Failed to generate sales report",
//       error.message
//     );
//   }
// };



export const getSalesReport = async (req, res) => {
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

    const sales = await Sale.find(filter)
      .populate("warehouse")
      .populate("items.product")
      .sort({ createdAt: -1 });

    const totalSalesRevenue = sales.reduce((total, sale) => {
      return total + sale.total_amount;
    }, 0);

    const totalSales = sales.length;

    const report = {
      totalSalesRevenue,
      totalSales,
      sales
    };

    return sendSuccess(
      res,
      200,
      "Sales report retrieved successfully",
      report
    );
  } catch (error) {
    console.error("Error generating sales report:", error);

    return sendError(
      res,
      500,
      "Failed to generate sales report",
      error.message
    );
  }
};
