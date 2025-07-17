const router = require('express').Router();
const authorization = require('../middlewares/authorization.js');
const { body } = require('express-validator');
const { logincontrol } = require('../controllers/usercontrollers.js');
const User = require('../models/usermodel.js');
const { signupcontrol } = require('../controllers/usercontrollers.js');
const { logoutcontrol } = require('../controllers/usercontrollers.js');
const upload = require('../config/multer.js');
const { lostfomrcontrol } = require('../controllers/usercontrollers.js');
const { foundformcontrol } = require('../controllers/usercontrollers.js');
const {deleteControl} =require("../controllers/Responsecontroller.js")
const { responsecontrol } = require('../controllers/Responsecontroller.js');

router.get('/',authorization,responsecontrol);
 router.post("/delete",authorization,deleteControl)


module.exports = router;