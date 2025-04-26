const bcrypt = require("bcrypt");
const Users = require("../model/user.model");
const {
    genAccessToken,
    genRefreshToken,
    verifyToken,
} = require("../utils/token");
const sendMail = require("../utils/nodemailer");
const { sendOTP, createVerificationCheck } = require("../utils/twilio");
const createPDF = require("../utils/pdfMaker");

const userRegister = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({ email: email });

        if (user) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "User is Already exists",
            });
        }

        try {
            const hashPass = await bcrypt.hash(password, 10);
            const user = await Users.create({ ...req.body, password: hashPass });
            const userData = await Users.findById(user?._id).select("-password");

            const otp = Math.floor(100000 + Math.random() * 900000);  
            
            sendMail(email, 'Verify your account with Fruitables', `your verifiacation otp is ${otp}`);

            // sendOTP();

            const docDefinition = {
                content: [
                    {
                        image: "public/fruitable.png",
                        cover: {
                            width: 200,
                            height: 100,
                            valign: "center",
                            align: "center",
                        },
                        style: "logo",
                    },
                    { text: "User Tables", style: "mainHeader" },
                    {
                        style: "userTable",
                        columns: [
                            { width: "*", text: "" },
                            {
                                width: "auto",
                                table: {
                                    body: [
                                        ["Name", "Email", "Role"],
                                        [`${user.name}`, `${user.email}`, `${user.role}`],
                                    ],
                                },
                            },
                            { width: "*", text: "" },
                        ],
                    },
                    "               ",
                    {
                        text: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
                        style: "paragraph",
                    },
                ],
                styles: {
                    mainHeader: {
                        fontSize: 18,
                        bold: true,
                        alignment: "center",
                        margin: [0, 0, 0, 10],
                    },
                    userTable: {
                        width: "auto",
                        margin: [0, 10, 0, 10],
                        alignment: "center",
                    },
                    logo: {
                        alignment: "center",
                    },
                    paragraph: {
                        alignment: "left",
                        margin: [0, 10, 0, 10],
                    },
                },
            };

            await createPDF(docDefinition, user.name);            

            return res.status(201).json({
                success: true,
                data: userData,
                message: "User Registration is Successfully.",
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                data: null,
                message: "Internal Server Error " + error.message,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: "Internal Server Error " + error.message,
        });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { otp, email } = req.body;

        const verifiacation = await createVerificationCheck(otp);

        if (!verifiacation && verifiacation !== "approved") {
            return res.status.json({
                success: false,
                message: "please enter correct otp.",
            });
        }

        await Users.findOneAndUpdate(
            { email: email },
            { isVerified: true },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "your otp verification is done please login.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error " + error.message,
        });
    }
};

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userData = await Users.findOne({ email: email });

        if (!userData) {
            return res.status(404).json({
                success: false,
                data: null,
                message: "User is not found.",
            });
        }

        if (!userData?.isVerified) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "you are not verified, please verify your account with OTP.",
            });
        }

        try {
            const isCorrectPassword = await bcrypt.compare(
                password,
                userData?.password
            );

            if (!isCorrectPassword) {
                return res.status(400).json({
                    success: false,
                    data: null,
                    message: "Wrong password.",
                });
            }

            const accessToken = genAccessToken(userData?._id, userData?.role);
            const refreshToken = genRefreshToken(userData?._id);

            userData.refreshToken = refreshToken;

            await userData.save({ validateBeforeSave: false });

            const user = await Users.findById(userData?._id).select(
                "-password -refreshToken"
            );

            const cookiesOpt = {
                httpOnly: true,
                secure: true,
            };

            return res
                .status(200)
                .cookie("accessToken", accessToken, cookiesOpt)
                .cookie("refreshToken", refreshToken, cookiesOpt)
                .json({
                    success: true,
                    data: user,
                    message: "correct credential!",
                });
        } catch (error) {
            return res.status(500).json({
                success: false,
                data: null,
                message: "Invalid Password " + error.message,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: "Internal Server Error " + error.message,
        });
    }
};

const generateNewToken = async (req, res) => {
    try {
        const token =
            req.cookies.refreshToken ||
            req.headers.authorization?.replace("Bearer ", "");
        if (!token) {
            return res.status(404).json({
                success: false,
                message: "refresh token is not found",
            });
        }
        try {
            const decodedData = verifyToken(
                token,
                process.env.REFRESHTOKEN_SCERET_KEY
            );
            if (!decodedData) {
                return res.status(400).json({
                    success: false,
                    data: null,
                    message: "invaild credential: token is expires/invaild.",
                });
            }
            const user = await Users.findById(decodedData?.user).select("-password");

            if (token !== user?.refreshToken) {
                return res.status(400).json({
                    success: false,
                    data: null,
                    message: "Invaild User Token",
                });
            }

            const accessToken = genAccessToken(user?._id);
            const refreshToken = genRefreshToken(user?._id);

            user.refreshToken = refreshToken;

            await user.save({ validateBeforeSave: false });

            const cookiesOpt = {
                httpOnly: true,
                secure: true,
            };

            return res
                .status(200)
                .cookie("accessToken", accessToken, cookiesOpt)
                .cookie("refreshToken", refreshToken, cookiesOpt)
                .json({
                    success: true,
                    data: user,
                    message: "new token generated ",
                });
        } catch (error) {
            return res.status(500).json({
                success: false,
                data: null,
                message: "Internal Server Error " + error.message,
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: "Internal Server Error " + error.message,
        });
    }
};

const userLogout = async (req, res) => {
    try {
        const { id } = req.body;

        await Users.findByIdAndUpdate(
            id,
            {
                $unset: {
                    refreshToken: 1,
                },
            },
            { new: true }
        );

        const cookieOpt = {
            httpOnly: true,
            secure: true,
        };

        return res
            .status(200)
            .clearCookie("accessToken", cookieOpt)
            .clearCookie("refreshToken", cookieOpt)
            .json({
                success: true,
                message: "user logout successfully.",
            });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: "Internal Server Error " + error.message,
        });
    }
};

const checkAuth = async (req, res) => {
    try {
        const token =
            req.cookies.accessToken ||
            req.headers.authorization?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "access token is not found",
            });
        }
        const decodedData = verifyToken(token, process.env.ACCESSTOKEN_SCERET_KEY);
        if (!decodedData) {
            return res.status(401).json({
                success: false,
                data: null,
                message: "invaild credential: token is expires/invaild.",
            });
        }

        const userData = await Users.findById(decodedData?.user).select(
            "-password -refreshToken"
        );

        return res.status(200).json({
            success: true,
            data: userData,
            message: "user authenticated",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: "Internal Server Error " + error.message,
        });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await Users.findOneAndUpdate(
            { email: email },
            {
                $unset: {
                    password: 1,
                    refreshToken: 1
                },
                isVerified: false
            },
            {
                new: true
            }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            })
        }

        sendOTP();

        return res.status(200).json({
            success: true,
            message: 'please is verified with OTP.'
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error " + error.message,
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({ email: email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            })
        }

        const hashPass = await bcrypt.hash(password, 10);

        user.password = hashPass;

        await user.save({ validateBeforeSave: false });

        return res.status(200).json({
            success: true,
            message: "your password has been set you can login."
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Erron " + error.message
        })
    }
}

module.exports = {
    userRegister,
    userLogin,
    userLogout,
    generateNewToken,
    forgotPassword,
    resetPassword,
    checkAuth,
    verifyOTP,
};
