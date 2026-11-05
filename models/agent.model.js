import mongoose from "mongoose";

const agentSchema = new mongoose.Schema({
    first_name:{
        type: String,
        required: true,
        uppercase: true,
        trim: true
    },
    last_name:{
        type: String,
        required: true,
        uppercase: true,
        trim: true
    },
    contact:{
        type: String,
        required: true,
        trim: true,
        minlength: 11,
        maxlength: 11
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique:true
    },
     avatar:[
    {
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
    }
]

   
}, {timestamps: true});

const Agent = mongoose.model("Agent", agentSchema);
export default Agent;