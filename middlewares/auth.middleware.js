import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import  dotenv  from "dotenv";


dotenv.config()

export const authMiddleware = async(req, res, next)=>{
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

        const user = await User.findById(decoded.id).select("-password");

        if(!user){
            return res.status(401).json({
                success:false,
                message:"User account no longer exists"
            })
        }

        req.user = user;
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