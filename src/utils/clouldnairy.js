const cloudinary = require('cloudinary').v2;


const uploadFileWithCloudinary = async (filePath, foldername) => {
    try {
        // Configuration
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_API_KEY,
            api_secret: process.env.CLOUD_API_SECRET
        });

        // Upload an image
        const uploadResult = await cloudinary.uploader
            .upload(
                filePath, {
                public_id: foldername,
                folder: foldername
            }
            )
            .catch((error) => {
                console.log(error);
            });
        
        return uploadResult;
    } catch (error) {
        console.log(error)
    }
}

module.exports = uploadFileWithCloudinary;