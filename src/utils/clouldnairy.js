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

const deleteFileWithCloudinary = async (public_id) => {
    try {
        // Configuration
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_API_KEY,
            api_secret: process.env.CLOUD_API_SECRET
        });
        // delete image in cloudinary   
        const deleteResult = await cloudinary.uploader.destroy(public_id);
        return deleteResult;
    } catch (error) {
        console.error(error.message);
    }
}

module.exports = {
    uploadFileWithCloudinary,
    deleteFileWithCloudinary
};