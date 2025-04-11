const sendOTP = () => {
    try {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_ACCOUNT_AUTH_TOKEN;
        const client = require('twilio')(accountSid, authToken);

        client.verify.v2.services(process.env.TWILIO_ACCOUNT_SERVICE_SID)
            .verifications
            .create({ to: '+919724994299', channel: 'sms' })
            .then(verification => console.log(verification.sid))
            .catch(error => console.log(error));
    } catch (error) {
        console.log(error);
    }   
}

async function createVerificationCheck(code) {
    try {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_ACCOUNT_AUTH_TOKEN;
        const client = require('twilio')(accountSid, authToken);
        const verificationCheck = await client.verify.v2
            .services(process.env.TWILIO_ACCOUNT_SERVICE_SID)
            .verificationChecks.create({
                code: code,
                to: "+919724994299",
            })            

        return verificationCheck;
        
    } catch (error) {
        console.error(error);
    }
    
}

module.exports = {
    sendOTP,
    createVerificationCheck
};