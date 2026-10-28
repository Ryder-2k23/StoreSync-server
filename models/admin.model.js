import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
     first_name:{
        type:String,
        required: [true, "First name is required"],
        trim: true
    },
    last_name:{
        type:String,
        required: [true, "Last name is required"],
        trim: true
    },
    email:{
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        unique: true,
        lowercase: true
    },
    contact:{
        type: String,
        required: [true, "Phone number is required"],
        unique:true,
        trim:true
    },
    password:{
        type: String,
        required: [true, "Password is required"],
        minlength:[6, "Password must be at least 6 characters"],
        select:false,
    },
     role:{
        type: String,
        default: "admin",
        required:true,
        lowercase: true
    },
    avatar:{
        url: {
            type: String,
            trim:true,
            default:null
        },
        public_id: {
            type: String,
            trim:true,
            default:null
        }
    },
    bio:{
        type:String,
        default:null
    },
}, {timestamps: true})

const Admin = mongoose.model("Admin",adminSchema );
export default Admin;