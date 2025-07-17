const { validationResult } = require('express-validator');
const User = require('../models/usermodel.js');
const bcrypt = require('bcrypt');
const redisclient = require("../services/redis.js");
const lostItems = require('../models/lostitems.js');
const foundItems = require('../models/founditems.js');



async function itemcontrol(req, res) {
    const item_id = req.params.id;
    const { message } = req.query;
    console.log(message);
    
   if(message==="lostitem") {
    const itemdetails = await lostItems.findOne({ _id: item_id });
    // 
    const user_id = itemdetails.userid;
    const userdetails = await User.findOne({ _id: user_id });
    if (!itemdetails) {
        return res.status(404).json({
            status: false,
            message: "Item not found"
        });
    }
    delete userdetails._doc.password;

    console.log(userdetails);
    res.status(200).json({
        status: true,
        item: itemdetails,
        user: userdetails,
        message: "Item found"
        
    });
    //
   }else{
    const itemdetails = await foundItems.findOne({ _id: item_id });
        const user_id = itemdetails.userid;
    const userdetails = await User.findOne({ _id: user_id });
    if (!itemdetails) {
        return res.status(404).json({
            status: false,
            message: "Item not found"
        });
    }
    delete userdetails._doc.password;

    console.log(userdetails);
    res.status(200).json({
        status: true,
        item: itemdetails,
        user: userdetails,
        message: "Item found"
        
    });
   }
    

}

async function allitemcontrol(req, res) {
  try {
    const allLost = await lostItems.find({});
    
    const allFound = await foundItems.find({});

    return res.status(200).json({
      status: true,
      message: 'Successfully fetched all items.',
      data: {
        lostItems: allLost,
        foundItems: allFound,
      },
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    return res.status(500).json({
      status: false,
      message: 'Server error while fetching items.',
    });
  }
}




module.exports = {itemcontrol,allitemcontrol };