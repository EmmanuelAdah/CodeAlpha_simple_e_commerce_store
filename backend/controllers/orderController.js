const Order = require("../models/orderModel");
const User = require("../models/userModel");
const { getProducts } = require("./productsController");

exports.getOrders = async (req, res) => {
    const { id } = req.params;

    try {
        const existingUser = await User.exists({_id: id})
        if (!existingUser)
            return res.status(400).json({error: 'User does not exist'});

        const products = await getProducts();
        if (products.length === 0)
            return res.status(404).json({message: 'No products found'});

        const orders = await Order.find({userId: id});
        if (orders.length === 0)
            return res.status(404).json({message: 'No orders found'});

        let usersOrder;
        let count = 0;

        while(count !== orders.length){
            let totalAmount = 0;
            let currentOrderList = orders[count];

            for (let product of products) {
                if (currentOrderList.some(orderedProduct => orderedProduct._id === product._id)) {
                    usersOrder[count] += product;
                    totalAmount += product.price;
                }
            }
            currentOrderList += { 'totalAmount': totalAmount };
        }
        return res.status(200).json(usersOrder);
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