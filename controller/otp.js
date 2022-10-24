const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_ID;
const client = require("twilio")(accountSid, authToken, serviceSid);

exports.sendOtp = async (phone) => {
  try {
    const data = await client.verify.v2
      .services(serviceSid)
      .verifications.create({
        to: `+91${phone}`,
        channel: "sms",
      });
  } catch (error) {
    next(error);
  }
};

exports.verifyOtp = async (phone, otp) => {
  try {
    const data = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({
        to: `+91${phone}`,
        code: otp,
      });
    return data;
  } catch (error) {
    next(error);
  }
};
