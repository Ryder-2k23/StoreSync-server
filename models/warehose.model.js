import mongoose from "mongoose";

const warehouseSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        trim: true,
        uppercase: true
    },
    address:{
        type:String,
        required: true,
        trim: true,
        lowercase: true
    },
    city:{
        type:String,
        required: true,
        trim: true,
        lowercase: true
    },
     country:{
        type:String,
        required: true,
        trim: true,
        lowercase: true
    },
    status:{
        type: String,
        enum: ["active", "inactive", "suspended"],
        default: "active",
        lowercase: true
    },
    ware_bank:{
        type:String,
        trim:true,
        default:null
    },
    ware_bank_account:{
        type:String,
        trim:true,
        default:null,
        minlength: 10,
        maxlength: 10
    },
    warehouse_image:[
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
],
    manager_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Manager", 
        default: null
    }
},{timestamps: true});

const Warehouse = mongoose.model("Warehouse", warehouseSchema);
export default Warehouse;