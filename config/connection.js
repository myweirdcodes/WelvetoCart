const mongoose  = require("mongoose");
// const mongoose_connect = process.env.MONGODB_CONNECTION_ID

mongoose.connect("mongodb://localhost:27017/WelvetoDB",{
    useNewUrlParser:true,
    useUnifiedTopology:true
},(err)=>{
    if(err){
        console.log('connection err'+err)
    }
    else{
        console.log('connection established')
    }
});