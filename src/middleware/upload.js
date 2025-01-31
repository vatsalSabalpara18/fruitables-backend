const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {    
        const filePath = path.join("public",file.fieldname);

        fs.mkdir(filePath, {recursive: true} ,(err) => {
            if(err) {
                console.log(err)
            }
        });
        cb(null, filePath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)        
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
})

const upload = multer({ storage: storage });

module.exports = upload;