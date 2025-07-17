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
const { uploadcontrol } = require('../controllers/usercontrollers.js');


router.post('/login',
    body('email').isEmail().withMessage('plase enter a valid email'),
    body('password').isLength({ min: 3 }).withMessage('password must be at least 3 characters long'),
    logincontrol);


router.post("/signup",
    body('email').isEmail().withMessage("please enter a valid email"),
    body('password').isLength({ min: 3 }).withMessage('password must be at least 3 characters long'),
    body('phoneNumber').isLength({ min: 5 }).withMessage('phone number must be at least 10 characters long'),
    signupcontrol);



router.get("/logout", authorization, logoutcontrol);
router.post("/lostform", authorization, upload, lostfomrcontrol);
router.post("/foundform", authorization, upload, foundformcontrol);
router.post("/upload-profile",authorization,upload,uploadcontrol)



module.exports = router; 
