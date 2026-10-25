import bcrypt from "bcryptjs";
import env from "dotenv";
import jwt from "jsonwebtoken";
import { sendSuccess, sendError } from "../utils/response.js";

import Product from "../models/products.model.js";
import Warehouse from "../models/warehose.model.js";
import Stock from "../models/stock.model.js";
import Category from "../models/categories.model.js";

env.config();

export const createStock = async(req, res)=>{
    try {
        const { product, warehouse,quantity,category } = req.body;
        if(!product || !warehouse || !quantity || !category){
            return sendError(res,400,"Please provide all required fields")
        }

        const stock = await Stock.create({
            product,
            warehouse,
            quantity,
            category
        });
        return sendSuccess(res,201,"Stock created successfully", stock);
    } catch (error) {
        console.error("Error creating Stock: ", error);
        return sendError(res, 500, "Failed to create stock", error.message)
    }
}


export const retrieveStock = async(req, res)=>{
    try {
       const stock = await Stock.find().sort({createdAt: -1})
       .populate("product", "product_image product_name unitPrice reorderThreshold inStock")
       .populate("category", "cat_name")
       .populate("warehouse", "ware_name ware_address")

        return sendSuccess(res,201,"Stock retrieved successfully", stock);
    } catch (error) {
        console.error("Error retrieving Stock: ", error);
        return sendError(res, 500, "Failed to retrieve stock", error.message)
    }
}


export const getStockById = async(req, res)=>{
    try {
        const { stock_id } = req.params;
        const stock = await Stock.findById(stock_id)
        .populate("product", "product_image product_name unitPrice reorderThreshold inStock")
        .populate("category", "cat_name")
        .populate("warehouse", "ware_name ware_address");

        if(!stock){
            return sendError(res,400, "Stock not found");
        }

        return sendSuccess(res, 200, "Stock retrieved succeessfuly!", stock);
    } catch (error) {
        console.error("Error retrieving Stock: ", error);
        return sendError(res, 500, "Failed to retrieve stock", error.message)
    }
}

export const updateStock = async(req, res)=>{
    try {
        const { stock_id } = req.params;
        const stock = await Stock.findByIdAndUpdate(stock_id, req.body, { new: true, runValidators: true })

        if(!stock){
             return sendError(res, 400, "Stock not found")
        }  

        return sendSuccess(res, 201, "Stock updated succeessfuly!", stock);
    } catch (error) {
        console.error("Error updating Stock: ", error);
        return sendError(res, 500, "Failed to update stock", error.message)
    }
}

export const deleteStock = async(req, res)=>{
    try {
        const { stock_id } = req.params;
        const stock = await Stock.findByIdAndDelete(stock_id)

        if(!stock){
            return sendError(res,400,"Stock not found")
        }

        return sendSuccess(res, 201, "Stock deleted successfully!")
    } catch (error) {
        console.error("Error deleting Stock: ", error);
        return sendError(res, 500, "Failed to delete stock", error.message)
    }
}

export const getStockByWarehouse = async(req, res)=>{
    try {
        const { warehouse_id } = req.params;

        const warehouse = await Warehouse.findById(warehouse_id);

        if(!warehouse){
            return sendError(res, 404, "Warehouse does not exist")
        }

        const stock = await Stock.find({
            warehouse: warehouse._id
        }).populate("product", "product_image product_name unitPrice reorderThreshold inStock")
       .populate("category", "cat_name")
       .populate("warehouse", "ware_name ware_address");

        if(!stock){
            return sendError(res, 404, "No stock found under this warehouse");
        }

        return sendSuccess(res, 200, "Stock retrieved successfully", stock)
    } catch (error) {
        console.error("Error retrieving Stock: ", error);
        return sendError(res, 500, "Failed to retrieve stock", error.message)
    }
}

export const getStockByWarehouseOfCategory = async(req, res)=>{
    try {
        const { warehouse_id } = req.params;
        const { cat_id } = req.params;


        const warehouse = await Warehouse.findById(warehouse_id);
        const category = await Category.findById(cat_id);

        if(!warehouse){
            return sendError(res, 404, "Warehouse not found")
        }

        if(!category){
            return sendError(res, 404, "Category not found")
        }

        const stock = await Stock.find({
            warehouse: warehouse._id,
            category: category._id
        }).populate("product", "product_image product_name unitPrice reorderThreshold inStock")
       .populate("category", "cat_name")
       .populate("warehouse", "ware_name ware_address");

        if(!stock){
            return sendError(res, 404, "No stock found under this warehouse of the requested category");
        }

        return sendSuccess(res, 200, "Stock retrieved successfully", stock)
    } catch (error) {
        console.error("Error retrieving Stock: ", error);
        return sendError(res, 500, "Failed to retrieve stock", error.message)
    }
}