const jwt = require('jsonwebtoken');

exports.generateToken = async (payload) =>{
    return await jwt.sign(
                    payload,
                    process.env.SECRET_KEY,
                    { expiresIn: "24h" }
                    );
}

exports.userDetails = async (token, res) =>{
    return await res.cookie(
                    'Authorization', 'Bearer ' + token,
                    { expires: new Date(Date.now() + 1000 * 60 * 60 + 24),
                    httpOnly: process.env.NODE_ENV === 'production',
                    secure: process.env.NODE_ENV === 'production'
                    })
                .json({
                    success: true,
                    user: token,
                    message: 'User logged in successfully'
                });
}