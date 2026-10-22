import bcrypt from "bcryptjs";
import env from "dotenv";
import jwt from "jsonwebtoken";
import { sendSuccess, sendError } from "../utils/response.js";

import Product from "../models/products.model.js";
import Category from "../models/categories.model.js";

env.config();

export const createProduct = async(req, res)=>{
    try {
        const { product_name, unitPrice, reorderThreshold } = req.body;

        if(!product_name || !unitPrice || !reorderThreshold) {
            return sendError(res, 400, " Please provide all required fields");
        };

        const product = await Product.create({
            product_name,
            unitPrice,
            reorderThreshold,
            category: req.body.category,
            product_image: {
                url: req.file?.path || null,
                public_id: req.file?.filename || null
            }
        });

        return sendSuccess(res, 201, "Product created successfully", product);
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

export const getAllProducts = async(req, res)=>{
    try {
        const products = await Product.find().sort({ createdAt: -1 }).populate("category", "cat_name cat_img");
        return sendSuccess(res, 200, "Products retrieved successfully", products);

    } catch (error) {
        console.error("Error retrieving Products:", error);

        return sendError(
            res,
            500,
            "Failed to retrieve Products",
            error.message
        );
    }
}

export const getProductById = async(req, res)=>{
    try {
        const {product_id}= req.params;
        const product = await Product.findById(product_id).populate("category", "cat_name cat_img");

        if(!product){
            return sendError(res, 404, "Product not found");
        }

        return sendSuccess(res, 200, "Product retrieved successfully", product);
    } catch (error) {
        console.error("Error retrieving Products:", error);

        return sendError(
            res,
            500,
            "Failed to retrieve Products",
            error.message
        );
    }
}


// export const updateProduct = async(req, res)=>{
//     try {
//         const { product_id } = req.params;
//         const product= await Product.findByIdAndUpdate(product_id, req.body, { returnDocument: 'after', runValidators:true});

//         if(!product){
//             return sendError(res, 404, "Product not found");
//         };
//         return sendSuccess(res, 201, "Product updated successfully", product);
//     } catch (error) {
//         console.error("Error update Product: ", error);

//         return sendError(
//             res,
//             500,
//             "Failed to update product",
//             error.message
//         );
//     }
// }


export const updateProduct = async (req, res) => {
    try {
        const { product_id } = req.params;

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

        const product = await Product.findByIdAndUpdate(
            product_id,
            { $set: updateData },
            {
                returnDocument: "after",
                runValidators: true,
            }
        );

        if (!product) {
            return sendError(res, 404, "Product not found");
        }

        return sendSuccess(
            res,
            200,
            "Product updated successfully",
            product
        );
    } catch (error) {
        console.error("Error updating product:", error);

        return sendError(
            res,
            500,
            "Failed to update product",
            error.message
        );
    }
};


export const deleteProduct = async(req, res)=>{
    try {
        const { product_id } = req.params;
        const product = await Product.findByIdAndDelete(product_id);  
        if(!product){
            return sendError(res, 404, "Product not found");
        }
        return sendSuccess(res, 201, "Product deleted successfully");
    }catch (error) {
        console.error("Error deleting Product: ", error);

        return sendError(
            res,
            500,
            "Failed to delete product",
            error.message
        );
    }
}


export const getProductsByCategory = async (req, res) => {
    try {
        const { cat_id } = req.params;

        // 1. Validate the category ID
        // if (!mongoose.isValidObjectId(cat_id)) {
        //     return sendError(res, 400, "Invalid category ID");
        // }

        // 2. Check that the category exists
        const category = await Category.findById(cat_id);

        if (!category) {
            return sendError(res, 404, "Category not found");
        }

        // 3. Find all products belonging to this category
        const products = await Product.find({
            category: category.cat_id
        });

        if(!products){
            return sendError(res, 404, "No products found for this category");
        }


        // 4. Return the products
        return sendSuccess(
            res,
            200,
            "Products retrieved successfully",
            products
        );

    } catch (error) {
        console.error("Error fetching products by category:", error);

        return sendError(
            res,
            500,
            "Failed to retrieve products",
            error.message
        );
    }
};
