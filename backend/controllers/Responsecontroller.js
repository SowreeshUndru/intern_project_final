const { validationResult } = require('express-validator');
const User = require('../models/usermodel.js');
const bcrypt = require('bcrypt');
const redisclient = require("../services/redis.js");
const LostItem = require('../models/lostitems.js');
const FoundItem = require('../models/founditems.js');
const user = require('../models/usermodel.js');


async function responsecontrol(req, res) {
    const email=req.user.email;
    const userdetails=await User.findOne({email:email},{new:true}).populate("yourLostItems").populate("yourFoundItems");

    console.log(userdetails);

    res.status(200).json({
        status: true,
        message: "user details",
        data: userdetails,
        email:email,
        id:userdetails._id,
    });
}
async function deleteControl(req, res) {
    try {
      const { itemid } = req.body;
  
    
      await LostItem.deleteOne({ _id: itemid });
      await FoundItem.deleteOne({ _id: itemid });
  
      
      await User.updateMany(
        { yourLostItems: itemid },
        { $pull: { yourLostItems: itemid } }
      );
      await User.updateMany(
        { yourFoundItems: itemid },
        { $pull: { yourFoundItems: itemid } }
      );
  
      return res.status(200).json({ message: 'Item deleted and user references cleaned.' });


    } catch (err) {

      console.error('Delete error:', err);
      return res.status(500).json({ error: 'Internal server error' });


    }
  }
  

module.exports = {
    responsecontrol,
    deleteControl
};