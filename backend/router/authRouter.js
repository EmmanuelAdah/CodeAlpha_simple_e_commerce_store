const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/signin', authController.signin);
router.post('/signup', authController.signup);
router.post('/signout', authController.signout);

router.patch('/verify/user', authController.verificationEmail);
router.patch('/verified/reset', authController.verifyCode);

module.exports = router ;
