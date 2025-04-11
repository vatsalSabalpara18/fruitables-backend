const sendOTP = () => {
    try {
        const accountSid = 'AC879ee8289b1cb53a9486b3bd4285d08e';
        const authToken = 'f948a7e84a87cdf18ec80ac0c2cc6276';
        const client = require('twilio')(accountSid, authToken);

        client.verify.v2.services("VAc3ceadb9dd9b21fca4817add7fd4b46a")
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
        const accountSid = 'AC879ee8289b1cb53a9486b3bd4285d08e';
        const authToken = 'f948a7e84a87cdf18ec80ac0c2cc6276';
        const client = require('twilio')(accountSid, authToken);
        const verificationCheck = await client.verify.v2
            .services("VAc3ceadb9dd9b21fca4817add7fd4b46a")
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