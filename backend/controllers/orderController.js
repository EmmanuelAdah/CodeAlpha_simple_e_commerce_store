const Order = require("../models/orderModel");
const User = require("../models/userModel");
const { getProducts } = require("./productsController");

exports.getOrders = async (req, res) => {
    const { id } = req.params;
    console.log(id);

    try {
        const existingUser = await User.exists({_id: id})
        if (!existingUser)
            return res.status(400).json({message: 'User does not exist'});

        const products = await getProducts();
        if (products.length === 0)
            return res.status(404).json({message: 'No products found'});

        const orders = await Order.find({userId: id});
        if (orders.length === 0)
            return res.status(404).json({message: 'No orders found'});

        const usersOrder = processOrder(products);
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


exports.checkStatus = async (req, res) => {
    const { id } = req.params;
    console.log(id);

    const existingUser = await Order.findOne({_id: id});
    if (!existingUser) {
        return res.status(404).json({error: 'Order does not exist'});
    }
    return res.status(200).json(existingUser);
}


exports.createCheckout = async (req, res) => {
     try {
        const { cartItems, userId } = req.body;

        if (!cartItems || cartItems.length === 0)
            return res.status(400).json({ error: "Cart is empty" });

        const lineItems = serializeCart(cartItems);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: lineItems,
            success_url: "http://localhost:5500/pages/success.html",
            cancel_url: "http://localhost:5500/pages/cancel.html",
            metadata: { userId }
        });
            return res.json({ id: session.id });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Payment failed" });
        }
}

function processOrder(products) {
    let usersOrder = [];
        while(count !== orders.length){
            let totalAmount = 0;
            let currentOrderList = orders[count];

            for (let product of products) {
                if (currentOrderList.some(orderedProduct => orderedProduct._id === product._id)) {
                    usersOrder.push(product);
                    totalAmount += product.price;
                }
            }
            currentOrderList += { 'totalAmount': totalAmount };
        }
        return usersOrder;
}

function serializeCart(cartItems) {
    return cartItems.map(product => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: product.title,
                    images: [product.image || ""]
                },
                unit_amount: product.price * 100 // for converting price to cents
            },
            quantity: product.quantity
        }));
}