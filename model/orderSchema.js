const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    billingAddress:[
        {
        firstName: String,
        lastName:String,
        email:String,
        phone: Number,
        pincode: Number,
        address: String,
        city: String,
        state: String,
        landmark: String
    }],
    products:[
        {
        productId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Product",
        },
        quantity:{
            type:Number,
            default:1
        },
        price:{
            type:Number,
            default:0
        }
        }
    ],
    orderId: String,
    status: String,
    paymentMethod: String, 
    grandTotal: Number
},{timestamps:true})

const Order=mongoose.model('Order',orderSchema)
module.exports = Order;