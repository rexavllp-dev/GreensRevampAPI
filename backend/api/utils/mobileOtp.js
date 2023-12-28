

// otp sender
import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;


  
   


const client = twilio(accountSid, authToken);

const sendVerificationCode = async ( usr_mobile_number, otpCode ) => {
  console.log(usr_mobile_number);
  console.log(otpCode);
    try {
        const message = await client.messages.create({
            body: `Your verification code is: ${ otpCode}`,
            from: twilioPhoneNumber,
            to: usr_mobile_number
        });

        console.log(`Verification code sent to ${usr_mobile_number}. SID: ${message.sid}`);
    } catch (error) {
        console.error(`Error sending verification code to ${usr_mobile_number}: ${error.message}`);
    }
};



export default sendVerificationCode ;