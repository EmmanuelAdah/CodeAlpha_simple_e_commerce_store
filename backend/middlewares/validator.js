
const Joi = require("joi");

exports.signupValidation = Joi.object({
    username: Joi.string()
        .min(3)
        .max(30)
        .pattern(/^[A-Za-z0-9_]+$/)
        .required(),

    email: Joi.string()
        .min(6)
        .max(50)
        .required()
        .email({ tlds: { allow: ['com', 'net'] } }),

    gender: Joi.string()
        .lowercase()
        .valid("male", "female", "other")
        .required(),

    password: Joi.string()
        .required()
        .pattern(new RegExp(`^(?=.*[A-Za-z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{6,30}$`))
        .messages({
            "string.pattern.base": "Password must be between 6 to 30 characters and include letters, numbers, and symbols."
        })
});

exports.signinValidation = Joi.object({
    email: Joi.string()
        .min(6)
        .max(50)
        .required()
        .email({ tlds: { allow: ['com', 'net'] }}),

    password: Joi.string()
        .required()
})

exports.verificationCodeSchema = Joi.object({
    email: Joi.string()
    .min(6)
    .max(50)
    .required()
    .email({ tlds: { allow: ['com', 'net'] }}),

    providedCode: Joi.number()
    .required()
})

exports.productSchema = Joi.object({
    title: Joi.string()
        .required(),
    description: Joi.string()
        .required(),
    price: Joi.number()
        .min(0)
        .max(1000000)
        .required(),
    image: Joi.string()
        .required(),
    rating: Joi.number()
        .min(0)
        .max(5)
        .required(),
})


