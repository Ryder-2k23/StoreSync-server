import mongoose from "mongoose";

const stockMovementSchema = new mongoose.Schema({
    product:
            {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
            required:true
        }
    ,
    warehouse:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Warehouse",
            required:true
    },
    quantity_affected: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be a whole number"
    }
    },
    movementType:{
        type: String,
        enum: ["stock-in","stock-out", "adjusted-in", "adjusted-out"],
        lowercase: true,
        required:true
    },
    reason:{
        type:String,
        lowercase:true,
        trim:true,
        required:true
    },
    referenceType:{
        type: String,
        enum: ["purchase","sale","adjustment"],
        lowercase: true,
        required:true
    },
    referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
}
},{timestamps:true});



const StockMovement = mongoose.model("StockMovement",stockMovementSchema );
export default StockMovement;
