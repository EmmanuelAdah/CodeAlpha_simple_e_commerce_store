const mongoose = require("mongoose");

const orderModel = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 200,
        trim: true,
    },
    products: [{
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        title: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        image: String,
        }
    ],
    totalAmount: {
        type: Number,
        required: true,
        default: 0,
    },
    deliveryAddress: {
        type: String,
        required: false,
        trim: true,
        maxlength: 200,
        minlength: 6,
    },
    paymentStatus: {
        type: Boolean,
        default: false,
    },
    paymentState: {
        type: String,
        default: "pending",
    },
    deliveryStatus: {
        type: Boolean,
        default: false,
    },
    deliveryState: {
        type: String,
        default: "pending",
    },
    checkoutReceipt: {

    },
}, {timestamps: true});

module.exports = mongoose.model("Order", orderModel);
