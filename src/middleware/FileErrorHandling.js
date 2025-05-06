const upload = require("./upload");

const FileErrorHandling = ( foldername ) => (req, res, next) => {
    upload.single(foldername)(req, res, function (err) {
        if (err) {
            return res.status(400).json({
                success: false,
                message: "Error during upload file " + err
            })
        }
        next();
    })
}

module.exports = FileErrorHandling;