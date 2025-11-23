const mongoose = require("mongoose");

const orderModel = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 200,
        trim: true,
    },
    totalAmount: {
        type: Number,
        required: true,
        default: 0,
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
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
    }
}, {timestamps: true});

module.exports = mongoose.model("Order", orderModel);
