const express = require('express');

const { userController } = require('../../../controllers');
const passport = require('passport');
const { genAccessToken, genRefreshToken } = require('../../../utils/token');
const Users = require('../../../model/user.model');

const { userRegister, userLogin, userLogout, generateNewToken, forgotPassword, resetPassword, checkAuth, verifyOTP } = userController

const router = express.Router();

router.post('/register', userRegister);
router.post('/login', userLogin);
router.post('/logout', userLogout);
router.post('/gen-new-token', generateNewToken);
router.get('/check-auth', checkAuth);
router.post('/verify-otp', verifyOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    async function (req, res) {
        // Successful authentication, redirect home.
        console.log('req.user', req?.user);

        try {
            if (!req.user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found."
                })
            }

            const userData = await Users.findById(req.user._id).select("-password");

            const accessToken = genAccessToken(userData?._id, userData?.role);
            const refreshToken = genRefreshToken(userData?._id);

            userData.refreshToken = refreshToken;

            await userData.save({ validateBeforeSave: false });

            const user = await Users.findById(userData?._id).select("-password -refreshToken");

            const cookiesOpt = {
                httpOnly: true,
                secure: true
            }


            res.status(200)
                .cookie('accessToken', accessToken, cookiesOpt)
                .cookie('refreshToken', refreshToken, cookiesOpt)
                .redirect('http://localhost:3000/');
                // .json({
                //     success: true,
                //     data: user,
                //     message: "correct credential!"
                // });
                            
        } catch (error) {
            console.log(error);
        }
    });

module.exports = router