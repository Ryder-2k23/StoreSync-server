import bycrypt from "bcryptjs";
import env from "dotenv";
import jwt from "jsonwebtoken";
import { sendSuccess, sendError } from "../utils/response.js";

import Product from "../models/products.model.js";
import Supplier from "../models/supplier.model.js";
import Warehouse from "../models/warehose.model.js";
import Category from "../models/categories.model.js";
import Purchase from "../models/purchase.model.js";

export const createPurchase = async(req, res)=>{
    try {
        const { supplier, product, warehouse, qty_recieved, unit_purchase_cost, status, total_cost } = req.body;
        
        if(!supplier || !product || !warehouse || !qty_recieved || !unit_purchase_cost, status, total_cost){
            return sendError(
                res,
                400,
                "Please provide all required fields"
            );
        };
        
        const purchase = await Purchase.create({
            supplier,
            product,
            warehouse,
            qty_recieved,
            unit_purchase_cost,
            status,
            total_cost
        });

        return sendSuccess(res,201,"Purchase created successfully", purchase);
    } catch (error) {
        console.error("Error creating Product: ", error);
        
        return sendError(
            res,
            500,
            "Failed to create product",
            error.message
        );
    }
}

export const getAllPurchase = async(req, res)=>{
    try {
        const purchase = await Purchase.find().sort({createdAt:-1})
        .populate("warehouse", "ware_name ware_address ware_city ware_country")
        .populate("product", "product_name unitPrice")
        .populate("category", "cat_name")
        .populate("supplier", "supplier_name agent_contact supplier_location")
        
        return sendSuccess(res, 200, "Purchase recorded sucessfully!")
    } catch (error) {
        console.error("Error recording purchase: ", error);
        
        return sendError(
            res,
            500,
            "Failed to record purchase",
            error.message
        );
    }
}

export const getPurchaseById = async(req, res)=>{
    try {
        const { purchase_id } = req.params;

        const purchase = await Purchase.findById(purchase_id)
        .populate("warehouse", "ware_name ware_address ware_city ware_country")
        .populate("product", "product_name unitPrice")
        .populate("category", "cat_name")
        .populate("supplier", "supplier_name agent_contact supplier_location")

        if(!purchase){
            return sendError(res, 404, "Purchase not found");
        }
        
        return sendSuccess(res, 200, "Purchase recorded successfully", purchase);
    } catch (error) {
        console.error("Error recording purchase: ", error);
        
        return sendError(
            res,
            500,
            "Failed to record purchase",
            error.message
        );
    }
}

export const updatePurchase = async(req, res)=>{
    try {
        const { purchase_id } = req.params;
        const updateData = {...req.body};

        const purchase = await Purchase.findByIdAndUpdate(
            purchase_id,
            updateData,
            { returnDocument: 'after', runValidators:true}
        )

        if(!purchase){
            return sendError(
                res,
                404,
                "Purchase not found"
            )
        }

        return sendSuccess(res, 201, "Purchase updated successfully", purchase);
    } catch (error) {
        console.error("Error updating purchase: ", error);
        
        return sendError(
            res,
            500,
            "Failed to update purchase",
            error.message
        );
    }
}


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