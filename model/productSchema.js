const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name:{
        type:String
    },
    brandName:{
        type:String
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },
    description:{
        type:String
    },
    stock:{
        type:Number
    },
    price:{
        type:Number
    },
    image:{
        type:Array
    }
},{timestamps:true})

const Product = mongoose.model("Product",ProductSchema)

module.exports = Product
