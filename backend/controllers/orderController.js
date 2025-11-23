const Order = require("../models/orderModel");
const User = require("../models/userModel");


exports.getOrders = async (req, res) => {
    const { id } = req.params;
    try {
        const existingUser = await User.exists({_id: id})
        if (!existingUser) {
            return res.status(404).json({error: 'User does not exist'});
        }
        const orders = await Order.find({userId: id});
        return res.status(200).json(orders);
    }catch(err) {
        res.status(500).json({error: 'Something went wrong'});
    }
};

exports.createOrder = async (req, res) => {
    const { id } = req.params;
    const { products } = req.body;

    try {
        const isExistingUser = await User.exists({_id: id});
        if (!isExistingUser) {
            return res.status(404).json({error: 'User does not exist'});
        }
        const totalPrice = products.reduce((sum, product) => sum + product.price, 0);
        const order = await new Order({
            userId: userId,
            products: products,
            totalPrice: totalPrice,
        }).save();

        return res.status(201).json(order);
    }catch(err) {
        return res.status(500).json(err.message);
    }
}