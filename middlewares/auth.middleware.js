import jwt from "jsonwebtoken";
import Staff from "../models/staff.model.js";
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

        const staff = await Staff.findById(decoded.id).select("-password +role");

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


export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // Authentication middleware should run first
        if (!req.staff) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        // Check whether the logged-in staff member has permission
        if (!allowedRoles.includes(req.staff.role)) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to perform this action"
            });
        }

        next();
    };
};
