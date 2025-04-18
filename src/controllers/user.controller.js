const bcrypt = require('bcrypt');
const Users = require("../model/user.model");
const { genAccessToken, genRefreshToken, verifyToken } = require('../utils/token');
const sendMail = require('../utils/nodemailer');
const { sendOTP, createVerificationCheck } = require('../utils/twilio');

const userRegister = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({ email: email });

        if (user) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "User is Already exists"
            })
        }

        try {
            const hashPass = await bcrypt.hash(password, 10);
            const user = await Users.create({ ...req.body, password: hashPass });
            const userData = await Users.findById(user?._id).select("-password");

            const otp = console.log(Math.floor(100000 + Math.random() * 900000));

            sendOTP();

            // sendMail(email, 'Verify your account with Fruitables', `your verifiacation otp is ${otp}`);

            return res.status(201).json({
                success: true,
                data: userData,
                message: "User Registration is Successfully."
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                data: null,
                message: "Internal Server Error " + error.message
            })
        }



    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: "Internal Server Error " + error.message
        })
    }
}

const verifyOTP = async (req, res) => {
    try {
        const { otp } = req.body;

        const verifiacation =  await createVerificationCheck(otp);

        return res.status(200).json({
            success: true,
            data: verifiacation,
            message: 'verification OTP'
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error ' + error.message
        })
    }
}

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userData = await Users.findOne({ email: email });

        if (!userData) {
            return res.status(404).json({
                success: false,
                data: null,
                message: "User is not found."
            })
        }

        try {

            const isCorrectPassword = await bcrypt.compare(password, userData?.password);

            if (!isCorrectPassword) {
                return res.status(400).json({
                    success: false,
                    data: null,
                    message: "Wrong password."
                })
            }

            const accessToken = genAccessToken(userData?._id, userData?.role);
            const refreshToken = genRefreshToken(userData?._id);

            userData.refreshToken = refreshToken;

            await userData.save({ validateBeforeSave: false });

            const user = await Users.findById(userData?._id).select("-password -refreshToken");

            const cookiesOpt = {
                httpOnly: true,
                secure: true
            }

            return res.status(200)
                .cookie('accessToken', accessToken, cookiesOpt)
                .cookie('refreshToken', refreshToken, cookiesOpt)
                .json({
                    success: true,
                    data: user,
                    message: "correct credential!"
                })

        } catch (error) {
            return res.status(500).json({
                success: false,
                data: null,
                message: "Invalid Password " + error.message
            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: "Internal Server Error " + error.message
        })
    }
}

const generateNewToken = async (req, res) => {
    try {

        const token = req.cookies.refreshToken || req.headers.authorization?.replace("Bearer ", "");
        if (!token) {
            return res.status(404).json({
                success: false,
                message: "refresh token is not found"
            })
        }
        try {
            const decodedData = verifyToken(token, process.env.REFRESHTOKEN_SCERET_KEY);
            if (!decodedData) {
                return res.status(400).json({
                    success: false,
                    data: null,
                    message: "invaild credential: token is expires/invaild."
                })
            }
            const user = await Users.findById(decodedData?.user).select("-password");

            if (token !== user?.refreshToken) {
                return res.status(400).json({
                    success: false,
                    data: null,
                    message: "Invaild User Token"
                })
            }

            const accessToken = genAccessToken(user?._id);
            const refreshToken = genRefreshToken(user?._id);

            user.refreshToken = refreshToken;

            await user.save({ validateBeforeSave: false });

            const cookiesOpt = {
                httpOnly: true,
                secure: true
            }

            return res.status(200)
                .cookie("accessToken", accessToken, cookiesOpt)
                .cookie("refreshToken", refreshToken, cookiesOpt)
                .json({
                    success: true,
                    data: user,
                    message: "new token generated "
                })
        } catch (error) {
            return res.status(500).json({
                success: false,
                data: null,
                message: "Internal Server Error " + error.message
            })
        }


    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: "Internal Server Error " + error.message
        })
    }
}

const userLogout = async (req, res) => {
    try {

        const { id } = req.body;

        await Users.findByIdAndUpdate(id, {
            $unset: {
                refreshToken: 1
            }
        }, { new: true });

        const cookieOpt = {
            httpOnly: true,
            secure: true
        }

        return res.status(200)
            .clearCookie("accessToken", cookieOpt)
            .clearCookie("refreshToken", cookieOpt)
            .json({
                success: true,
                message: "user logout successfully."
            })

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: "Internal Server Error " + error.message
        })
    }
}

const checkAuth = async (req, res) => {
    try {
        const token = req.cookies.accessToken || req.headers.authorization?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "access token is not found"
            })
        }
        const decodedData = verifyToken(token, process.env.ACCESSTOKEN_SCERET_KEY);
        if (!decodedData) {
            return res.status(401).json({
                success: false,
                data: null,
                message: "invaild credential: token is expires/invaild."
            })
        }

        const userData = await Users.findById(decodedData?.user).select("-password -refreshToken");

        return res.status(200).json({
            success: true,
            data: userData,
            message: "user authenticated"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: "Internal Server Error " + error.message
        })
    }
}

module.exports = {
    userRegister,
    userLogin,
    userLogout,
    generateNewToken,
    checkAuth,
    verifyOTP
}