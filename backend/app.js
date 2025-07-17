const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv").config();
const app = express();
const homeRoute = require("./routes/home.js");
const loginRoute = require("./routes/user.js");
const connectDB = require("./db/db.js");
const { connect } = require("mongoose");
const redisclient = require("./services/redis.js");
const responseRoute = require("./routes/Response.js");
const cors = require("cors");
const itemroute = require("./routes/item.js")

const allowedOrigins = [
    'http://localhost:5173',
    'http://10.62.11.165:5173',
];

connectDB();

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));


app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", homeRoute);
app.use("/user", loginRoute);
app.use("/response", responseRoute);
app.use("/item", itemroute);









module.exports = app;