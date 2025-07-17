
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const foundItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: [7, "Description should be less than 7 characters"],

    },
    color: {
        type: String,
        maxlength: [7, "Description should be less than 7 characters"],
    },
    brand: {
        type: String,
        required: true,
        maxlength: [7, "Description should be less than 7 characters"],
    },
    serialnumber: {
        type: String,
        maxlength: [7, "Description should be less than 7 characters"],
    },
    question: {
        type: String,
        required: true,
        maxlength: [20, "Description should be less than 7 characters"],
    },
    description: {
        type: String,
        required: true,
        maxlength: [200, "Description should be less than 7 characters"],
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    image: {
        data: Buffer,
        contentType: String,
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isresolved:{
        type:Boolean,
        default:false
    }
});

const FoundItem = mongoose.model("FoundItem", foundItemSchema);
module.exports = FoundItem;