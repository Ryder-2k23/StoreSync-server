import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
    supplier_name:{
        type: String,
        required: true,
        uppercase: true,
        trim: true
    },
    supplier_agent:{
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    agent_contact:{
        type: String,
        required: true,
        trim: true,
        minlength: 11,
        maxlength: 11
    },
    supplier_email:{
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique:true
    },
    supplier_location:{
        type:String,
        required: true,
        trim:true
    },
    delivery_address:{
        type: String,
        required: true,
        trim: true,
    },
    status:{
        type: String,
        enum: ["active", "inactive", "suspended"],
        default: "active",
        lowercase: true
    },
    website:{
        type: String,
        trim: true,
        default: null
    },
    business_type:{
        type: String,
        trim: true,
        enum: ["manufacturer", "distributor", "company", "individual"], 
        lowercase: true,
        default: null
    },
    currency_of_transaction:{
        type: String,
        lowercase:true,
        default:null
    },
    sup_bank:{
        type:String,
        trim:true,
        default:null
    },
    sup_bank_account:{
        type:String,
        trim:true,
        default:null,
        minlength: 10,
        maxlength: 10
    }
}, {timestamps: true});

const Supplier = mongoose.model("Supplier", supplierSchema);
export default Supplier;