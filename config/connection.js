const mongoose  = require("mongoose");
const mongoose_connect = process.env.MONGODB_CONNECTION_ID

// db connection with database in localStorage

// mongoose.connect("mongodb://localhost:27017/WelvetoDB",{
//     useNewUrlParser:true,
//     useUnifiedTopology:true
// },(err)=>{
//     if(err){
//         console.log('connection err'+err)
//     }
//     else{
//         console.log('connection established')
//     }
// });


// db connectin with database in atlas cloud storage

mongoose.connect(mongoose_connect,{
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