const router=require("express").Router();
const authorization=require("../middlewares/authorization.js");
const User = require("../models/usermodel.js");
const { authcontrol } = require("../controllers/homecontroller.js");



router.get("/auth/verify",authorization,authcontrol);

module.exports=router;
