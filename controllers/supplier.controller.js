import bycrypt from "bcryptjs";
import env from "dotenv";
import jwt from "jsonwebtoken";
import { sendSuccess, sendError } from "../utils/response.js";

import Supplier from "../models/supplier.model.js";

export const createSupplier = async(req, res)=>{
    try {
        const { supplier_name,supplier_agent,agent_contact,supplier_email,supplier_location,delivery_address } = req.body;

        if(!supplier_name || !supplier_agent || !agent_contact || !supplier_email || !supplier_location || !delivery_address){
            return sendError(
                res,
                400,
                "Please provide all required fields"
            )
        }

        const supplier = await Supplier.create({
            supplier_name,
            supplier_agent,
            agent_contact,
            supplier_email,
            supplier_location,
            delivery_address
        });

        return sendSuccess(res, 201, "Supplier created successfully", supplier);


    }catch(error){
        console.error("Error creating supplier: ", error);

        return sendError(
            res,
            500,
            "Failed to create supplier",
            error.message
        );
    }
}

export const getAllSuppliers = async(req, res)=>{
    try {
        const suppliers = await Supplier.find().sort({ createdAt: -1 });
        return sendSuccess(res, 200, "Suppliers retrieved successfully", suppliers);
    } catch(error){
        console.error("Error retrieve supplier: ", error);

        return sendError(
            res,
            500,
            "Failed to retrieve supplier",
            error.message
        );
    }
}

export const getSupplierById = async(req, res)=>{
    try {
        const { sup_id } = req.params;
        const supplier = await Supplier.findById(sup_id);

        if(!supplier){;
            return sendError(
                res,
                404,
                "Supplier not found"
            )
        }

        return sendSuccess(res, 200, "Supplier retrieved successfully", supplier);
    } catch(error){
        console.error("Error retrieve supplier: ", error);

        return sendError(
            res,
            500,
            "Failed to retrieve supplier",
            error.message
        );
    }
}

export const updateSupplier = async(req, res)=>{
    try {
        const { sup_id } = req.params;

        const updateData ={...req.body};

        const supplier = await Supplier.findByIdAndUpdate(
            sup_id,
            updateData,
            { returnDocument: 'after', runValidators:true}
        );

        if(!supplier){
            return sendError(
                res,
                404,
                "Supplier not found"
            )
        }

        return sendSuccess(res, 201, "Supplier updated successfully", supplier);

    } catch(error){
        console.error("Error updating supplier: ", error);

        return sendError(
            res,
            500,
            "Failed to update supplier",
            error.message
        );
    }
}


export const deleteSupplier = async(req, res)=>{
    try {
        const { sup_id } = req.params;
        const supplier = await Supplier.findByIdAndDelete(sup_id);

        if(!supplier){
            return sendError(
                res,
                404,
                "Supplier not found"
            )
        };

        return sendSuccess(res, 201, `supplier deleted successfully`);

    } catch(error){
        console.error("Error updating supplier: ", error);

        return sendError(
            res,
            500,
            "Failed to update supplier",
            error.message
        );
    }
}