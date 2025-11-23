const mongoose = require("mongoose");


const productModel = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Product name is required'],
        minlength: 3,
        maxlength: 200,
        unique: true,
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: 0,
        max: 100000000,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        minlength: 5,
        maxlength: 10000,
        trim: true
    },
    image: {
        type: String,
        required: [true, 'Product image is required'],
        minlength: 5,
        maxlength: 10000,
        trim: true,
    },
    rating: {
        type: Number,
        default: 0,
        mutable: true,
        min: 0,
        max: 5,
        required: false,
    }
}, {timestamps: true});

module.exports = mongoose.model("Product", productModel);