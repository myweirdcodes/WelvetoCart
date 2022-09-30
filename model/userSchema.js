const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  phone:{
    type:Number,
    required:true
  },
  password:{
    type:String,
    required:true
  }
})

UserSchema.pre('save',async function(next){
    this.password = await bcrypt.hash(this.password,12);
    next()
});

const User = mongoose.model("User",UserSchema);

module.exports = User;

