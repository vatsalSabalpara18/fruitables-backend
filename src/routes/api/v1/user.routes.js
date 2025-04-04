const express = require('express');

const { userController } = require('../../../controllers');

const { userRegister, userLogin, userLogout, generateNewToken, checkAuth } = userController

const router = express.Router();

router.post('/register', userRegister);
router.post('/login', userLogin);
router.post('/logout', userLogout);
router.post('/gen-new-token', generateNewToken);
router.get('/check-auth', checkAuth);

module.exports = router