import mongoose from "mongoose";
import calculateTotalCost from "../middlewares/total_cost_purchase.middleware.js"

// const purchaseSchema = new mongoose.Schema({
//     supplier:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"Supplier",
//         required:true
//     },
//     product:[
//         {
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"Product",
//         required:true
//     }
//     ],
//     warehouse:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"Warehouse",
//         required:true
//     },
//     category:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"Category",
//         required:true
//     },
//     qty_recieved:[{
//         type:Number,
//         required:true
//     }],
//     unit_purchase_cost:[{
//         type:Number,
//         required:true
//     }],
//     status:{
//         type: String,
//         enum: ["completed","failed", "pending"],
//         default: "pending",
//         lowercase: true
//     },
//     total_cost: {
//         type: Number,
//         default: 0
//     }
// },{timestamps: true});

// //middleware to calcualte total cost b4 saving
// purchaseSchema.pre("save", calculateTotalCost);

// const Purchase = mongoose.model("Purchase",purchaseSchema );
// export default Purchase;






const purchaseSchema = new mongoose.Schema({
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supplier",
        required: true
    },

    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        unit_purchase_cost: {
            type: Number,
            required: true,
            min: 0
        }
    }],

    warehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Warehouse",
        required: true
    },

    status: {
        type: String,
        enum: ["completed", "failed", "pending"],
        default: "pending"
    },

    total_cost: {
        type: Number,
        default: 0
    }
},{timestamps:true});

//middleware to calcualte total cost b4 saving
purchaseSchema.pre("save", calculateTotalCost);

const Purchase = mongoose.model("Purchase",purchaseSchema );
export default Purchase;
