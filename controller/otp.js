const accountSid = "AC29e682715b21fa69d2047af579936a8f"
const authToken = "472b5c66051cebc9256a2f590ba8bac9"
const serviceSid = "MGb9964a2691ac00e7df2384402875b4d9"
const client = require('twilio')(accountSid,authToken)

// module.exports = {
//     doSms:(userData)=>{
//         console.log(userData,"dosms 1")
//         return new Promise(async(resolve,reject)=>{
//             console.log(userData.phone, 'dosms 0')
//             let res = {}
//             await client.verify.services(serviceSID).verifications.create({
//                 to:`+91${userData.phone}`,
//                 channel:"sms"
//             }).then((data)=>{
//                 res.valid = true
//                 console.log(res,'dosms 2')
//                 resolve(res)
//             }).catch((err)=>{
//                 console.log(err,'my error do sms')
//             })
//         })
//     },
//     otpVerify:(otpData,userData)=>{
//         return new Promise(async(resolve,reject)=>{
//             await client.verify.services(serviceID).verificationChecks.create({
//                 to:`+91${userData.phone}`,
//                 code: otpData
//             }).then((verifications)=>{
//                 resolve(verifications.valid)
//             })
//         })
//     }
// }



module.exports={
    doSms:(userData)=>{
        
        return new Promise(async(resolve,reject)=>{
            let res={}
            await client.verify.services(serviceSid).verifications.create({
               
                to :`+91${userData.phone}`,
                channel:"sms"
            }).then((reeee)=>{
                res.valid=true;
                resolve(res);
            }).catch((err)=>{
                console.log(err);

            })
        })
    },


 otpVerify:(otpData,userData)=>{
      console.log(otpData);
    console.log(userData.phone); 
   
    return new Promise(async(resolve,reject)=>{
        await client.verify.services(serviceSid).verificationChecks.create({
            to: `+91${userData.phone}`,
            code: otpData
        }).then((verifications) => {
            console.log(verifications);
            resolve(verifications.valid)
        });
    })
}



}