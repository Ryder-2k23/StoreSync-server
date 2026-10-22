import bycrypt from 'bcryptjs';
import env from 'dotenv';
import jwt from 'jsonwebtoken';
import { sendSuccess, sendError } from '../utils/response.js';

import Warehouse from '../models/warehose.model.js';

env.config();


export const createWarehouse = async(req, res) => {
    try {
        const { name,address,city,country } = req.body;

        if (!name || !address || !city || !country) {
            return sendError(
                res,
                400,
                'Please provide all required fields'
            );
        }

        const warehouse = await Warehouse.create({
            name,
            address,
            city,
            country,
            warehouse_image: {
                url: req.file?.path || null,
                public_id: req.file?.filename || null
            }
        });

        return sendSuccess(
            res,
            201,
            'Warehouse created successfully',
            warehouse
        );
    } catch (error) {
        console.error("Error creating warehouse: ", error);

        return sendError(
            res,
            500,
            "Failed to create warehouse",
            error.message
        );
    }
}

export const getAllWarehouses = async(req, res) => {
    try {
        const warehouses = await Warehouse.find().sort({createdAt:-1});
        return sendSuccess(
            res,
            200,
            "Warehouses retrieveed succeessfully",
            warehouses
        )
    } catch (error) {
        console.error("Error retieving warehouses: ", error);

        return sendError(
            res,
            500,
            "Failed to retrieve warehouses",
            error.message
        );
    }
} 

export const getWarehouseById = async(req, res) => {
    try {
       const { warehouse_id } = req.params;

       const warehouse = await Warehouse.findById(warehouse_id);

        if (!warehouse) {
            return sendError(res, 400, "Please provide warehouse ID");
        }

        return sendSuccess(res, 200, "Warehouse retrieved successfully", warehouse)
    } catch (error) {
        console.error("Error retieving warehouse: ", error);

        return sendError(
            res,
            500,
            "Failed to retrieve warehouse",
            error.message
        );
    }
}

export const updateWarehouse = async(req, res) => {
    try {
       const { warehouse_id } = req.params;

       const updateData = {...req.body};

       if (req.files && req.files.length > 0) {
            const images = req.files.map((file) => ({
                url: file?.path,
                public_id: file?.filename,
            }));

             if (images.some((image) => !image.url || !image.public_id)) {
                return sendError(
                    res,
                    500,
                    "Image upload did not return a valid URL and public ID"
                );
            }

            updateData.warehouse_image = images;
        }

        
        const warehouse = await Warehouse.findByIdAndUpdate(warehouse_id, updateData, { returnDocument: 'after', runValidators:true});

        if (!warehouse) {
            return sendError(res, 404, "Warehouse not found");
        }

        return sendSuccess(res, 201, "Warehouse updated successfully", warehouse);

    } catch (error) {
        console.error("Error updating warehouse: ", error);

        return sendError(
            res,
            500,
            "Failed to update warehouse",
            error.message
        );
    }
}


export const deleteWarehouse = async(req, res) => {
    try{
        const { warehouse_id } = req.params;
        const warehouse = await Warehouse.findByIdAndDelete(warehouse_id)

        if(!warehouse){
            return sendError(
                res,
                404,
                "Warehouse not found"
            )
        }

        return sendSuccess(res, 201, "Warehouse deleted successfully");
    }catch (error) {
        console.error("Error deleting warehouse: ", error);

        return sendError(
            res,
            500,
            "Failed to delete warehouse",
            error.message
        );
    }
}