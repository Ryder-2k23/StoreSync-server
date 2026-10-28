import mongoose from "mongoose";
import calculateTotalAmount from "../middlewares/total_cost_purchase.middleware.js"


const saleSchema = new mongoose.Schema({
    warehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Warehouse",
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
        min: 1,
        validate: {
            validator: Number.isInteger,
            message: "Quantity must be a whole number"
        }
        },
        unit_selling_price: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    total_amount:{
        type: Number,
        min: 0
    },
    status: {
    type: String,
    enum: ["completed", "cancelled"],
    default: "completed",
    lowercase: true
}
},{timestamps:true})


//middleware to calcualte total cost b4 saving
saleSchema.pre("save", calculateTotalAmount);

const Sale = mongoose.model("Sale",saleSchema );
export default Sale;