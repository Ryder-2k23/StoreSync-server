import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import  dotenv  from "dotenv";


dotenv.config()

const calculateTotalCost = function(){
    this.total_cost = this.qty_recieved * this.unit_purchase_cost;
};

export default calculateTotalCost