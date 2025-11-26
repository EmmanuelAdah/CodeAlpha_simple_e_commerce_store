
const { signupValidation, verificationCodeSchema} = require('../middlewares/validator');
const { doHash, doValidation, hmacProcess} = require("../middlewares/hasher");
const User = require("../models/userModel");
const { generateToken, userDetails } = require("../middlewares/jwtGenerator");
const transport = require("../middlewares/emailSender");
const crypto = require('crypto');


exports.signin = async (req, res) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({email}).select('+password');
    if (!existingUser) {
        return res.status(401)
                    .json({'message':'Invalid email or password'});
    }
    const valid = await doValidation(password, existingUser.password);
    if (!valid) {
        return res.status(401)
                    .json({'message':'Invalid email or password'});
    }
    const payload = {
        'userId': existingUser.id,
        'email': existingUser.email,
    }
    const token = await generateToken(payload);
    return await userDetails(token, res);
}


exports.signup = async (req, res) => {
    const { username, email, gender, password } = req.body;

    try{
     const {error} = signupValidation.validate({ username, email, gender: gender.toLowerCase(), password });

        if(error){
             return res.status(400).send(error.details[0].message);
         }
         let existingUser = await User.findOne({ email });

        if(existingUser){
             return res.status(400).json({success: false, 'message': 'User already exists'});
         }
         const hashedPassword = await doHash(password);

         const savedUser = await new User({
             username,
              email,
             gender: gender.toLowerCase(),
             password: hashedPassword
          }).save();

        const userResponse = {
            id: savedUser.id,
            email: savedUser.email
        };
        const token = await generateToken(userResponse);
        return await userDetails(token, res);
     } catch (err) {
        res.status(400).json(err.message);
    }
}

exports.signout = async (req, res) => {
    res.clearCookie('Authorization')
        .status(200).json({
            success: true,
            message: 'User logged out successfully'
            });
}

exports.verificationEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: 'Not a verified user' });
        }
        const verificationCode = crypto.randomInt(100000, 999999).toString();

        const sentMail = await transport.sendMail({
            from: process.env.EMAIL_SENDER_ADDRESS,
            to: existingUser.email,
            subject: 'Verification code',
            html: `<h3 xmlns="http://www.w3.org/1999/html">Your verification code is <strong>${verificationCode}</strong>.<br>Use this six-digit code to reset your password</h3>`
        });

        if (sentMail.accepted.includes(existingUser.email)) {
            existingUser.verificationCode = hmacProcess(
                verificationCode,
                process.env.HMAC_VERIFICATION_CODE_KEY
            );
            existingUser.verificationCodeExpiry = Date.now() + 1000 * 60 * 2;
            await existingUser.save();

            return res.status(200).json({ message: 'Verification code sent successfully' });
        }
        return res.status(500).json({ message: 'Email not delivered' })
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};


exports.verifyCode = async (req, res) => {
    const { email, providedCode } = req.body;

    try {
        const { error } = verificationCodeSchema.validate({ email, providedCode });
        if (error)
            return res.status(400).send(error.details[0].message);
        const existingUser = await User.findOne({ email }).select('+verificationCode +verificationCodeExpiry');

        if (!existingUser)
            return res.status(400).json({
                success: false,
                message: 'Invalid verification code'
            });
        if(existingUser.verificationCodeExpiry < Date.now())
            return res.status(401).json({
                success: false,
                message: 'Invalid verification code. Try again!!'
            });

        const hashedCode = hmacProcess(
            providedCode.toString(),
            process.env.HMAC_VERIFICATION_CODE_KEY
        )
        if (hashedCode === existingUser.verificationCode && existingUser.verificationCodeExpiry < Date.now()) {
            existingUser.isVerified = true;
            existingUser.verificationCode = '';
            await existingUser.save()

            return res.status(200).json({
                success: true,
                message: 'Verification successful'
            });
        }
    } catch (err) {
        res.status(400).json(err.message);
    }
}
