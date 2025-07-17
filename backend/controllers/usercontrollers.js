const { validationResult } = require('express-validator');
const User = require('../models/usermodel.js');
const bcrypt = require('bcrypt');
const redisclient = require("../services/redis.js");
const LostItem = require('../models/lostitems.js');
const FoundItem = require('../models/founditems.js');

async function logincontrol(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    else {
        const { email, password, phoneNumber } = req.body;
        const user = await User.findOne({ email: email });
        const roomid = user?.roomid || "";

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        else {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    message: "Invalid email or password"
                });
            }
            else {
                const token = user.createToken();
                const blacklisted = await redisclient.get(token);
                if (blacklisted) {
                    await redisclient.del(token);
                }
                return res.status(200).json({
                    message: "Login successful",
                    token: token,
                    roomid: roomid
                });
            }
        }
    }
}


async function signupcontrol(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(200).json({ errors: errors.array(), message: "Invalid details" });
    }
    else {
        const { email, password, phoneNumber } = req.body;
        const user = await User.findOne({ email: email });
        if (user) {
            return res.status(401).json({
                message: "User already exists"
            });
        }
        else {
            const hashedPassword = User.hashPassword(password);
            const newUser = new User({
                email: email,
                password: hashedPassword,
                phoneNumber: phoneNumber
            });

            await newUser.save();
            const token = newUser.createToken();
            return res.status(200).json({
                message: "User created successfully",
                token: token
            });
        }
    }
}

async function logoutcontrol(req, res) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
    else {
        await redisclient.set(token, "logout", "EX", 60 * 60 * 24);
        res.status(200).json({
            message: "Logout successful"
        });
    }
}



async function lostfomrcontrol(req, res) {
    try {
        const {
            name,
            color,
            brand,
            serialnumber,
            question,
            description,
            location,
        } = req.body;

        const useremail = req.user.email;
        const user = await User.findOne({ email: useremail });
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!name || !color || !brand || !serialnumber || !question || !description || !location) {
            return res.status(422).json({ message: "All fields are required" });
        }

        if (!req.file) {
            return res.status(422).json({ message: "Image file is required" });
        }

        const newlostitem = await LostItem.create({
            name,
            color,
            brand,
            serialnumber,
            question,
            description,
            location,
            image: {
                data: req.file.buffer,
                contentType: req.file.mimetype
            },
            userid: user._id

        });

        const results = await FoundItem.find({
            $and: [
                { brand: { $exists: true, $ne: null, $regex: brand, $options: 'i' } },
                { name: { $exists: true, $ne: null, $regex: name, $options: 'i' } },
                { serialnumber: { $exists: true, $ne: null, $regex: serialnumber, $options: 'i' } },
                { color: { $exists: true, $ne: null, $regex: color, $options: 'i' } }
            ]
        });

        if (results.length > 0) {
            const lost_item_user_id = user._id;
            const found_item_user_id = results[0].userid;
            //console.log("results",results);
            console.log(lost_item_user_id);
            console.log(found_item_user_id);


            await User.updateOne(
                { _id: lost_item_user_id },
                {
                    $addToSet: { roomid: `${lost_item_user_id}.${found_item_user_id}**` }
                }
            );

            await User.updateOne(
                { _id: found_item_user_id },
                {
                    $addToSet: { roomid: `${lost_item_user_id}.${found_item_user_id}**` }
                }
            );
            console.log("found");
            return res.status(201).json({ message: "lost item found" });
        }


        const updatedUser = await User.findByIdAndUpdate(user._id, {
            $addToSet: { yourLostItems: newlostitem._id }
        }, { new: true });

        return res.status(200).json({
            message: "Lost item created successfully",
            lostitem: newlostitem
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}

async function foundformcontrol(req, res) {
    try {
        const {
            name,
            color,
            brand,
            serialnumber,
            question,
            description,
            location,
        } = req.body;

        const useremail = req.user.email;
        const user = await User.findOne({ email: useremail });
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!name || !color || !brand || !serialnumber || !question || !description || !location) {
            return res.status(422).json({ message: "All fields are required" });
        }

        if (!req.file) {
            return res.status(422).json({ message: "Image file is required" });
        }

        const newfounditem = await FoundItem.create({
            name,
            color,
            brand,
            serialnumber,
            question,
            description,
            location,
            image: {
                data: req.file.buffer,
                contentType: req.file.mimetype
            },
            userid: user._id
        });

        const results = await LostItem.find({
            $and: [
                { brand: { $exists: true, $ne: null, $regex: brand, $options: 'i' } },
                { name: { $exists: true, $ne: null, $regex: name, $options: 'i' } },
                { serialnumber: { $exists: true, $ne: null, $regex: serialnumber, $options: 'i' } },
                { color: { $exists: true, $ne: null, $regex: color, $options: 'i' } }
            ]
        });

        // 

        if (results.length > 0) {

            const found_item_user_id = user._id;
            const lost_item_user_id = results[0].userid;
            //console.log("results",results);
            console.log(lost_item_user_id);
            console.log(found_item_user_id);


            await User.updateMany(
                { _id: { $in: [lost_item_user_id, found_item_user_id] } },
                {
                    $addToSet: {
                        roomid: `${lost_item_user_id}.${found_item_user_id}**`
                    }
                }
            );

            console.log("found");
            return res.status(201).json({ message: "lost item found" });


        }

        // 
        const updatedUser = await User.findByIdAndUpdate(user._id, {
            $addToSet: { yourFoundItems: newfounditem._id }
        }, { new: true });


        return res.status(200).json({
            message: "found item created successfully",
            lostitem: newfounditem
        });





    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}

async function uploadcontrol(req, res) {
    const profile_pic = req.file;


    if (!profile_pic) {
        return res.status(400).json({ error: "File required" });
    }

    try {

        await User.updateOne(
            { email: req.user.email },
            {
                $set: {
                    profilepic: {
                        data: profile_pic.buffer,
                        contentType: profile_pic.mimetype
                    }
                }
            }
        );



        res.json({
            message: "Profile picture uploaded successfully"

        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Server error while uploading" });
    }
}


module.exports = {
    logincontrol,
    signupcontrol,
    logoutcontrol,
    lostfomrcontrol,
    foundformcontrol,
    uploadcontrol
}