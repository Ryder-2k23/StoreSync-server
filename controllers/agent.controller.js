import bcrypt from "bcryptjs";
import env from "dotenv";
import jwt from "jsonwebtoken";
import { sendSuccess, sendError } from "../utils/response.js";

import Agent from "../models/agent.model.js";

env.config();



//token generated
// const generateToken = (staff)=>{
//     return jwt.sign(
//         {
//             id:staff._id
//         },
//             process.env.JWT_SECRET, {
//             expiresIn: process.env.JWT_EXPIRES_IN || '10h'
//             }
//     );
// };

export const registerAgent =async(req, res)=>{
    try {
        const { first_name, last_name, email, contact } = req.body;

        if(!first_name || !last_name || !email || !contact){
            return sendError(
                res,
                400,
                "Please provide all required fields"
            )
        }

        // preventing malisciouse emails
        const normalizeEmail = email.toLowerCase();

        //Checking user existence
        const existingAgent = await Agent.findOne({email: normalizeEmail});

        if(existingAgent){
            return sendError(res, 409, "This agent already exists")
        }

        // hashing password
        // const hashPassword = await bcrypt.hash(password, 10);

        // staff profile 
        const agent = await Agent.create({
            first_name,
            last_name,
            email:normalizeEmail,
            contact
        })

        return sendSuccess(res, 201, "Agent created successfully!", agent);

        // const token = generateToken(staff);
        // return sendSuccess(res, 201,"Staff registration successful!",{accessToken: token});

    } catch (error) {
        console.error("Error registering agent: ", error);

        return sendError(
            res,
            500,
            "Failed to register agent",
            error.message
        );
    }
}

export const getAgents = async(req, res)=>{
    try {
        const agents = await Agent.find().sort({createdAt:-1});
        return sendSuccess(
            res,
            200,
            "Agent retrieved successfully",
            agents
        )
    } catch (error) {
        console.error("Error getting agents: ", error);

        return sendError(
            res,
            500,
            "Failed to get all agents",
            error.message
        );
    }
}

export const getSingleAgent = async(req, res)=>{
    try {
        const { agent_id } = req.params;

        const agent = await Agent.findById(agent_id);

        if(!agent){
            return sendError(
                res,
                404,
                "Agent  not found"
            )
        }

        return sendSuccess(
            res,
            200,
            "Agent retrieved successfully",
            agent
        )
    } catch (error) {
        console.error("Error getting agent: ", error);

        return sendError(
            res,
            500,
            "Failed to get agent",
            error.message
        );
    }
}


export const updatAgent = async(req, res)=>{
    try {
        const { agent_id } = req.params;

        // Only allow these fields to be updated
        const { first_name, last_name, avatar } = req.body;

        const updateData = {
            first_name,
            last_name,
            avatar
        };

        if(req.file){
            updateData.avatar = req.file.path;
        }

        const agent = await Agent.findByIdAndUpdate(
            agent_id, updateData, { new: true, runValidators: true }
        );

        if(!agent){
            return sendError(
                res,
                404,
                "Agent not found"
            )
        }

        return sendSuccess(
            res,
            200,
            "Agent updated successfully",
            agent
        )
    } catch (error) {
        console.error("Error updating agent: ", error);

        return sendError(
            res,
            500,
            "Failed to update agent",
            error.message
        );
    }
}



export const deleteAgent = async(req, res)=>{
    try {
        const { agent_id } = req.params;

        const agent = await Agent.findByIdAndDelete(agent_id);

        if(!agent){
            return sendError(
                res,
                404,
                "Agent not found"
            )
        }

        return sendSuccess(
            res,
            200,
            "Agent deleted successfully"
        )
    } catch (error) {
        console.error("Error deleting agent: ", error);

        return sendError(
            res,
            500,
            "Failed to delete agent",
            error.message
        );
    }
}