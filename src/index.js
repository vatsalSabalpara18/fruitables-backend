const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')

const router = require('./routes/api/v1/index');
const connectDB = require('./db/mongoDB');
const passport = require('passport');
const googleStrategy = require('./utils/googleStrategy');
const connectSocket = require('./utils/socket.io');

const app = express();

const corsOptions = {
    origin: 'https://fruitables-eight.vercel.app',
    optionsSuccessStatus: 200 ,// some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true
}

dotenv.config();
app.use(cors(corsOptions));
app.use(cookieParser());
app.use( '/public' ,express.static('public'));
connectDB();
app.use(express.json());
app.use(require('express-session')({ secret: process.env.EXPRESS_SESSION_SECRET_KEY, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
googleStrategy();
connectSocket(); 

app.get('/', (req, res) => {
    res.json({
        message: "Welcome to fruitables."
    })
})

app.use("/api/v1/", router);

// app.listen(process.env.PORT, () => {
//     console.log(`Server is lisning at ${process.env.PORT}`)
// })

module.exports = app;