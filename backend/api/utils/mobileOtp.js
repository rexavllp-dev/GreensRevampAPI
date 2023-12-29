import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SID
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;



const client = twilio(accountSid, authToken);

const sendVerificationCode = async (usr_mobile_number, otp) => {

    console.log(usr_mobile_number);
    console.log(otp);
    try {
        const message = await client.messages.create({
            body: `Your verification code is: ${otp}`,
            from: twilioPhoneNumber,
            to: usr_mobile_number

        });

        console.log(`Verification code sent to ${usr_mobile_number}. SID: ${message.sid}`);

    } catch (error) {
        console.log(error);
        console.error(`Error sending verification code to ${usr_mobile_number}: ${error.message}`);

    }




    // client.messages
    // .create({
    //     body: '',
    //     from: '+18557951583',
    //     to: '+917510720805'
    // })
    // .then((message) => console.log(message.sid))
    //   .catch(err => console.error(err))
};





export default sendVerificationCode;



