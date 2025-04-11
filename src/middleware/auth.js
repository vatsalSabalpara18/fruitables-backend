const Users = require("../model/user.model");
const { verifyToken } = require("../utils/token");

const auth = (roles) => async (req, res, next) => {
    try {

        const token = req.cookies.accessToken || req.headers.authorization.replace("Bearer ", "");
        if (!token) {
            return res.status(404).json({
                success: false,
                message: "access token is not found"
            })
        }
        const decodedData = verifyToken(token, process.env.ACCESSTOKEN_SCERET_KEY);
        if (!decodedData) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "invaild credential: token is expires/invaild."
            })
        }

        if (!roles?.includes(decodedData?.role)){
            return res.status(400).json({
                success: false,                
                message: "you have nnot access"
            })
        }

        const user = await Users.findById(decodedData?.user).select("-password");
        
        if(!user){
            return res.status(404).json({
                success: false,
                data: null,
                message: "user not found"
            })
        }

        req.user = user;
        next();
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error " + error.message
        })
    }
}

module.exports = auth;