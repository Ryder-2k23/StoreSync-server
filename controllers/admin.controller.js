import bcrypt from "bcryptjs";
import env from "dotenv";
import jwt from "jsonwebtoken";
import { sendSuccess, sendError } from "../utils/response.js";

import Admin from "../models/admin.model.js";
import Staff from "../models/staff.model.js";

env.config();



//token generated
const generateToken = (admin)=>{
    return jwt.sign(
        {
            id:admin._id
        },
            process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '10h'
            }
    );
};

export const registerAdmin =async(req, res)=>{
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
        const existingStaff = await Admin.findOne({email: normalizeEmail});

        if(existingStaff){
            return sendError(res, 409, "Admin already exists")
        }

        // hashing password
        const hashPassword = await bcrypt.hash(password, 10);

        // staff profile 
        const admin = await Admin.create({
            first_name,
            last_name,
            email:normalizeEmail,
            contact,
            password: hashPassword
        })

        return sendSuccess(res, 201, "Admin created successfully!", admin);

        const token = generateToken(admin);
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
        const staffs = await Staff.find().sort({createdAt:-1}).select("+role");
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

export const loginAdmin = async(req, res)=>{
    try {
        const { email, password } = req.body;
        if(!email || !password){
            return sendError(res, 400, "Invalid Email or parssword")
        }

        const normalizeEmail = email.toLowerCase();

        //including password so my hidden password from schema becomes found
        const admin = await Admin.findOne({email:normalizeEmail}).select("+password").select("+role");

        if(!admin){
            return sendError(res, 401, "Admin is not found");
        };

        //unhashing password
        const passwordIsCorrect = await bcrypt.compare(password, admin.password);

        if(!passwordIsCorrect){
            return sendError(res, 401, "Invalid email or password");
        }

        const token = generateToken(admin);
        return sendSuccess(res, 200, "Login successful!", {
            admin:{
                id:admin._id,
                email:admin.email,
                role:admin.role
            },
            accessToken: token
        })

    } catch (error) {
        console.error("Error logging in admin: ", error);

        return sendError(
            res,
            500,
            "Failed to login admin",
            error.message
        );
    }
}

export const getSingleStaff = async(req, res)=>{
    try {
        const { staff_id } = req.params;

        const staff = await Staff.findById(staff_id).select("+role");

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

export const changeStaffRole = async (req, res) => {
    try {
        const { role } = req.body;
        const { staff_id } = req.params

        // Only allow valid roles
        const allowedRoles = [
            "staff",
            "storekeeper",
            "manager"
        ];

        if (!allowedRoles.includes(role)) {
            return sendError(
                res, 400, "Invalid role"
            )
        }

        // Update ONLY the role field
        const staff = await Staff.findByIdAndUpdate(
            staff_id,
            { $set: { role: role } },
            { new: true, runValidators: true }
        ).select("-password");

        if (!staff) {
            return sendError(res, 404, "Staff not found")  
        }

        return sendSuccess(res, 200, "Staff role updated successfully", staff )

    } catch (error) {
        console.error("Error changing role: ", error);

        return sendError(
            res,
            500,
            "Failed to change role",
            error.message
        );
    }
};

export const updateAdminProfile = async(req, res)=>{
    try {
        const { admin_id } = req.params;

        const updateData = {
            ...req.body
        };

        if(req.file){
            updateData.avatar = req.file.path;
        }

        const admin = await Admin.findByIdAndUpdate(
            admin_id, updateData, { new: true, runValidators: true }
        );

        if(!admin){
            return sendError(
                res,
                404,
                "Admin not found"
            )
        }

        return sendSuccess(
            res,
            200,
            "Admin updated successfully",
            admin
        )
    } catch (error) {
        console.error("Error updatig admin: ", error);

        return sendError(
            res,
            500,
            "Failed to update admin",
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