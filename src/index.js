const dotenv = require('dotenv');
const express = require('express');

const router = require('./routes/api/v1/index');

const app = express();
dotenv.config();

app.use(express.json());

app.use("/api/v1/", router);

app.listen(process.env.PORT, () => {
    console.log(`Server is lisning at ${process.env.PORT}`)
})

