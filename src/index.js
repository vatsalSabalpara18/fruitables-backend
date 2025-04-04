const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')

const router = require('./routes/api/v1/index');
const connectDB = require('./db/mongoDB');

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 ,// some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true
}

dotenv.config();
app.use(cors(corsOptions));
app.use(cookieParser());
app.use( '/public' ,express.static('public'));
connectDB();
app.use(express.json());

app.use("/api/v1/", router);

app.listen(process.env.PORT, () => {
    console.log(`Server is lisning at ${process.env.PORT}`)
})

