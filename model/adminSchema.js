const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const AdminSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})




AdminSchema.pre('save',async function(next){
    this.password = await bcrypt.hash(this.password,12)
    next();
})

const Admin = mongoose.model("Admin",AdminSchema);



module.exports = Admin