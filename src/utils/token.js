const jwt = require('jsonwebtoken');

function genAccessToken(userId, role) {    

    const accessTokenPayload = {
        user: userId,
        role: role,
        expiresIn: process.env.ACCESSTOKEN_EXPIRY_TIME
    };

    const accessToken = jwt.sign(accessTokenPayload, process.env.ACCESSTOKEN_SCERET_KEY, { expiresIn: process.env.ACCESSTOKEN_EXPIRY_TIME });

    return accessToken;
}

function genRefreshToken(userId) {    

    const refreshTokenPayload = {
        user: userId,
        expiresIn: process.env.REFRESHTOKEN_EXPIRY_TIME
    };

    const refreshToken = jwt.sign(refreshTokenPayload, process.env.REFRESHTOKEN_SCERET_KEY, { expiresIn: process.env.REFRESHTOKEN_EXPIRY_TIME });

    return refreshToken;
}

function verifyToken (refreshToken, secret) {
    const decoded = jwt.verify(refreshToken, secret);
    return decoded
}

module.exports = {
    genAccessToken,
    genRefreshToken,
    verifyToken
}
