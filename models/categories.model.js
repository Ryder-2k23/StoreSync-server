import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    cat_name:{
        type: String,
        required: true,
        uppercase: true,
        trim: true
    },
   
    cat_img:[
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

const Category = mongoose.model("Category", categorySchema);
export default Category;