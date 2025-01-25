const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
            .then(() => console.log("mongodb connected succesfully."))
                .catch((error) => console.log("error duraing mongodb connection" + error))
    } catch (error) {
        console.error(error);
    }
}

module.exports = connectDB;