import jwt from "jsonwebtoken";
import Staff from "../models/staff.model.js";
import Admin from "../models/admin.model.js";
import  dotenv  from "dotenv";


dotenv.config()

export const staffAuthMiddleware = async(req, res, next)=>{
    try {
        const authHeader = req.headers.authorization; //this simply means go to the headers and look for tokens cause every requests u make has headers

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                success:false,
                message:"Authentication required"
            })
        }
        const  token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const staff = await Staff.findById(decoded.id).select("+role");

        if(!staff){
            return res.status(401).json({
                success:false,
                message:"Staff account no longer exists"
            })
        }

        req.staff = staff;
        next()

    } catch (error) {
        console.error("Authentication error: ", error);
        if(error.name === "JsonWebTokenError"){
            return res.status(401).json({
                success: false,
                message: "Inavlid token"
            })
        }
        return res.status(401).json({
            success:false,
            message: "Autehntication failed"
        })
    }
}


export const adminAuthMiddleware = async(req, res, next)=>{
    try {
        const authHeader = req.headers.authorization; //this simply means go to the headers and look for tokens cause every requests u make has headers

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({
                success:false,
                message:"Authentication required"
            })
        }
        const  token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const admin = await Admin.findById(decoded.id).select("+role");

        if(!admin){
            return res.status(401).json({
                success:false,
                message:"Admin account no longer exists"
            })
        }

        req.admin = admin;
        next()

    } catch (error) {
        console.error("Authentication error: ", error);
        if(error.name === "JsonWebTokenError"){
            return res.status(401).json({
                success: false,
                message: "Inavlid token"
            })
        }
        return res.status(401).json({
            success:false,
            message: "Autehntication failed"
        })
    }
}

export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const user = req.admin || req.staff;
        // Authentication middleware should run first
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        // Check whether the logged-in staff member has permission
        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to perform this action"
            });
        }

        next();
    };
};
