const passport = require('passport');
const Users = require('../model/user.model');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const googleStrategy = () => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8081/api/v1/user/callback"
    },
        async function (accessToken, refreshToken, profile, cb) {
            console.log("profile", profile);

            const user = await Users.findOne({ googleId: profile?.id })

            if (!user) {
                const user = await Users.create({
                    name: profile?.displayName,
                    email: profile.emails[0]?.value,
                    googleId: profile?.id,
                    role: 'user'
                });
                return cb(null, user);
            }

            return cb(null, user);

            // User.findOrCreate({ googleId: profile.id }, function (err, user) {
            // return cb(err, user);
            // });
        }
    ));

    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(async function (_id, done) {
        try {

            const user = await Users.findById(_id);

            done(null, user);

        } catch (error) {

            console.log(error);
            done(error, null);

        }
        // User.findById(id, function (err, user) {
        //     done(err, user);
        // });
    });
}
module.exports = googleStrategy;