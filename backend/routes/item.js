const router=require("express").Router();
const authorization=require("../middlewares/authorization.js");
const User = require("../models/usermodel.js");
const { authcontrol } = require("../controllers/homecontroller.js");
const {itemcontrol,allitemcontrol} =require("../controllers/itemcontroller.js")

router.get("/allitems",authorization,allitemcontrol)

router.get("/:id",authorization,itemcontrol);



module.exports=router;