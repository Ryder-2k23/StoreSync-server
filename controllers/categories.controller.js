import bycrypt from "bcryptjs";
import env from "dotenv";
import jwt from "jsonwebtoken";
import { sendSuccess, sendError } from "../utils/response.js";

import Product from "../models/products.model.js";
import Category from "../models/categories.model.js";

env.config();

export const createCategory = async(req, res)=>{
    try {
        const { cat_name } = req.body;

        if(!cat_name){
            return sendError(
                res,
                400,
                "Please provide all required fields"
            )
        }

        const product = await Category.create({
            cat_name,
            cat_img:{
                url: req.file?.path || null,
                public_id: req.file?.filename || null
            }
        });

        return sendSuccess(res, 201, "Category created successfully", product);

        }catch (error) {
        console.error("Error creating category: ", error);

        return sendError(
            res,
            500,
            "Failed to create category",
            error.message
        );
    }
} 


export const getAllCategories = async(req, res)=>{
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        return sendSuccess(res, 200, "Categories retrieved successfully", categories);
    } catch (error) {
        console.error("Error retrieving category: ", error);

        return sendError(
            res,
            500,
            "Failed to retrieve category",
            error.message
        );
    }
}

export const getCategoryById = async(req, res)=>{
    try {
        const { cat_id }= req.params;
        const category = await Category.findById(cat_id);

        if(!category){
            return sendError(
                res,
                404,
                "Category not found"
            )
        }


        return sendSuccess(res, 200, "Category retrieved successfully", category);
    } catch (error) {
        console.error("Error retrieving category: ", error);

        return sendError(
            res,
            500,
            "Failed to retrieve category",
            error.message
        );
    }
}

export const updateCategory = async (req, res) => {
    try {
        const { cat_id } = req.params;

        // Start with the ordinary product fields
        const updateData = { ...req.body };

        // Only update images when new files are uploaded
        if (req.files && req.files.length > 0) {
            const images = req.files.map((file) => ({
                url: file.path,
                public_id: file.filename,
            }));

            // Make sure Cloudinary returned the image details
            if (images.some((image) => !image.url || !image.public_id)) {
                return sendError(
                    res,
                    500,
                    "Image upload did not return a valid URL and public ID"
                );
            }

            updateData.product_image = images;
        }

        const category = await Category.findByIdAndUpdate(
            cat_id,
            { $set: updateData },
            {
                returnDocument: "after",
                runValidators: true,
            }
        );

        if (!category) {
            return sendError(res, 404, "Category was not found");
        }

        return sendSuccess(
            res,
            200,
            "Product updated successfully",
            category
        );
    } catch (error) {
        console.error("Error updating category:", error);

        return sendError(
            res,
            500,
            "Failed to update category",
            error.message
        );
    }
};


export const deleteCategory = async(req, res)=>{
    try{
        const { cat_id } = req.params;
        const category = await Category.findByIdAndDelete(cat_id);

        if(!category){
            return sendError(res, 404, "Category not found");
        }

        return sendSuccess(res, 200, `${category.cat_name} has been deleted successfully`);
    }catch(error){
        console.error("Error deleting category: ", error);

        return sendError(
            res,
            500,
            "Failed to delete category",
            error.message
        );
    }
}