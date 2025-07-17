const { validationResult } = require('express-validator');
const User = require('../models/usermodel.js');
const bcrypt = require('bcrypt');
const redisclient = require("../services/redis.js");
const LostItem = require('../models/lostitems.js');
const FoundItem = require('../models/founditems.js');
async function authcontrol(req, res) {
    const email = req.user.email;
    try {
        const userdetails = await User.findOne({ email: email }); // this returns all fields

        if (!userdetails) {
            return res.status(401).json({
                status: false,
                message: "Unauthorized"
            });
        }

        delete userdetails._doc.password;
        delete userdetails._doc.phoneNumber;
        console.log(userdetails.roomid);

        return res.status(200).json({
            status: true,
            email: email,
            data: userdetails,
            array: userdetails.roomid,
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            data: null
        });
    }
}

module.exports = {
    authcontrol
};
