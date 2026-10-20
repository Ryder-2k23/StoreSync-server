import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'node:dns';

dotenv.config();

export const connectDB =async ()=>{
    try {
        if(process.env.isPublicDns){
            dns.setServers(['8.8.8.8',  '8.8.4.4']);
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log("☑️ Mongodb is connected!");
        
    } catch (error) {
        console.error("❌ Mongodb disconnected...", error);
        process.exit(1);
    }
}