const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    email:{
        type:String
    },
    phone:{
        type:Number,
    },
    pincode:{
        type:String
    },
    address:{
        type:String
    },
    city:{
        type:String
    },
    state:{
        type:String
    },
    landmark:{
        type:String
    }
},{timestamps:true});


const Address = new mongoose.model('Address',addressSchema);

module.exports = Address;