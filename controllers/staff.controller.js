import bcrypt from "bcryptjs";
import env from "dotenv";
import jwt from "jsonwebtoken";
import { sendSuccess, sendError } from "../utils/response.js";

import Staff from "../models/staff.model.js";

env.config();



//token generated
const generateToken = (staff)=>{
    return jwt.sign(
        {
            id:staff._id
        },
            process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '10h'
            }
    );
};

export const registerStaff =async(req, res)=>{
    try {
        const { first_name, last_name, email, contact, password } = req.body;

        if(!first_name || !last_name || !email || !contact || !password){
            return sendError(
                res,
                400,
                "Please provide all required fields"
            )
        }

        // preventing malisciouse emails
        const normalizeEmail = email.toLowerCase();

        //Checking user existence
        const existingStaff = await Staff.findOne({email: normalizeEmail});

        if(existingStaff){
            return sendError(res, 409, "This staff already exists")
        }

        // hashing password
        const hashPassword = await bcrypt.hash(password, 10);

        // staff profile 
        const staff = await Staff.create({
            first_name,
            last_name,
            email:normalizeEmail,
            contact,
            password: hashPassword
        })

        return sendSuccess(res, 201, "Staff created successfully!", staff);

        const token = generateToken(staff);
        return sendSuccess(res, 201,"Staff registration successful!",{accessToken: token});

    } catch (error) {
        console.error("Error registering staff: ", error);

        return sendError(
            res,
            500,
            "Failed to register staff",
            error.message
        );
    }
}

export const getAllStaffs = async(req, res)=>{
    try {
        const staffs = await Staff.find().sort({createdAt:-1});
        return sendSuccess(
            res,
            200,
            "Staffs retrieved successfully",
            staffs
        )
    } catch (error) {
        console.error("Error getting staffs: ", error);

        return sendError(
            res,
            500,
            "Failed to get all staffs",
            error.message
        );
    }
}

export const loginStaff = async(req, res)=>{
    try {
        const { email, password } = req.body;
        if(!email || !password){
            return sendError(res, 400, "Invalid Email or parssword")
        }

        const normalizeEmail = email.toLowerCase();

        //including password so my hidden password from schema becomes found
        const staff = await Staff.findOne({email:normalizeEmail}).select("+password").select("+role");

        if(!staff){
            return sendError(res, 401, "Staff is not found");
        };

        //unhashing password
        const passwordIsCorrect = await bcrypt.compare(password, staff.password);

        if(!passwordIsCorrect){
            return sendError(res, 401, "Invalid email or password");
        }

        const token = generateToken(staff);
        return sendSuccess(res, 200, "Login successful!", {
            staff:{
                id:staff._id,
                email:staff.email,
                role:staff.role
            },
            accessToken: token
        })

    } catch (error) {
        console.error("Error logging in staff: ", error);

        return sendError(
            res,
            500,
            "Failed to login staff",
            error.message
        );
    }
}

export const getSingleStaff = async(req, res)=>{
    try {
        const { staff_id } = req.params;

        const staff = await Staff.findById(staff_id);

        if(!staff){
            return sendError(
                res,
                404,
                "Staff not found"
            )
        }

        return sendSuccess(
            res,
            200,
            "Staff retrieved successfully",
            staff
        )
    } catch (error) {
        console.error("Error getting staff: ", error);

        return sendError(
            res,
            500,
            "Failed to get staff",
            error.message
        );
    }
}

export const updateStaff = async(req, res)=>{
    try {
        const { staff_id } = req.params;

        const updateData = {
            ...req.body
        };

        if(req.file){
            updateData.avatar = req.file.path;
        }

        const staff = await Staff.findByIdAndUpdate(
            staff_id, updateData, { new: true, runValidators: true }
        );

        if(!staff){
            return sendError(
                res,
                404,
                "Staff not found"
            )
        }

        return sendSuccess(
            res,
            200,
            "Staff updated successfully",
            staff
        )
    } catch (error) {
        console.error("Error updatig staff: ", error);

        return sendError(
            res,
            500,
            "Failed to update staff",
            error.message
        );
    }
}


export const deleteStaff = async(req, res)=>{
    try {
        const { staff_id } = req.params;

        const staff = await Staff.findByIdAndDelete(staff_id);

        if(!staff){
            return sendError(
                res,
                404,
                "Staff not found"
            )
        }

        return sendSuccess(
            res,
            200,
            "Staff deleted successfully"
        )
    } catch (error) {
        console.error("Error deleting staff: ", error);

        return sendError(
            res,
            500,
            "Failed to delete staff",
            error.message
        );
    }
}