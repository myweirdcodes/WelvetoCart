const accountSid = "AC29e682715b21fa69d2047af579936a8f"
const authToken = "af652bced25631f7846fe70911e85699"
const serviceSid = "VAfd98a1b8c98a8c29ad92bfd49fcece58"
const client = require('twilio')(accountSid,authToken,serviceSid);

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



// module.exports={
//     doSms:(phone)=>{
//         console.log('hi')
//         return new Promise(async(resolve,reject)=>{
//             let res={}
//             await client.verify.services(serviceSid).verifications.create({
               
//                 to :`+91${phone}`,
//                 channel:"sms"
//             }).then((reeee)=>{
//                 res.valid=true;
//                 resolve(res);
//             }).catch((err)=>{
//                 console.log(err);

//             })
//         })
//     },


//  otpVerify:(otpData,userData)=>{
//       console.log(otpData);
//     console.log(userData.phone); 
   
//     return new Promise(async(resolve,reject)=>{
//         await client.verify.services(serviceSid).verificationChecks.create({
//             to: `+91${userData.phone}`,
//             code: otpData
//         }).then((verifications) => {
//             console.log(verifications);
//             resolve(verifications.valid)
//         });
//     })
// }



// }








exports.sendOtp = async (phone) => {
    try {
        console.log(phone)
        const data = await client.verify.v2.services(serviceSid).verifications.create({
            to: `+91${phone}`,
            channel: 'sms'
        })
    } catch (error) {
        console.log(error)
    }
}

exports.verifyOtp = async (phone, otp) => {
    console.log("ethi", "sddddddddddddddddddddddddddddddddddddddddddd")

    try {
        const data = await client.verify.v2.services(serviceSid).verificationChecks.create({
            to: `+91${phone}`,
            code: otp
        })
        return data

    } catch (error) {
        console.log(error)
    }
}