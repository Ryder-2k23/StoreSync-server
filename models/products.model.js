import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    product_name:{
        type: String,
        required: true,
        uppercase: true,
        trim: true
    },
    unitPrice:{
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    reorderThreshold:{
        type: String,
        lowercase: true,
        trim: true,
        required: true
    },
    quantity:{
        type: Number,
        default:0
    },
    inStock:{
        type: Boolean,
        enum: [true, false],
        default: true
    },
    product_image:[
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
     category: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Category", 
        default: null
    }
}, {timestamps: true});

const Product = mongoose.model("Product", productSchema);
export default Product;