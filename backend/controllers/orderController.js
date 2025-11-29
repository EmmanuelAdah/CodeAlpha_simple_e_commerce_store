const Order = require("../models/orderModel");
const User = require("../models/userModel");
const { getProducts } = require("./productsController");

let products = await getProducts();

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

        const usersOrder = processCartItems(products);
        return res.status(200).json(usersOrder);
    }catch(err) {
        res.status(500).json({error: 'Something went wrong'});
    }
};

exports.checkStatus = async (req, res) => {
    const { id } = req.params;

    const existingUser = await Order.findOne({_id: id});
    if (!existingUser) {
        return res.status(404).json({error: 'Order does not exist'});
    }
    return res.status(200).json(existingUser);
}


exports.createCheckout = async (req, res) => {
     try {
        const { cartItems, userId, address } = req.body;

        const user = await User.exists({_id: userId});
        if (!user)
            return res.status(400).json({message: 'User does not exist'});

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

        let savedOrder = {};
        const {orderProducts, totalPrice} = processCartItems(cartItems);
        const order = await new Order({
            userId: userId,
            products: orderProducts,
            totalAmount: totalPrice,
            deliveryAddress: address,
        });
        if(!session.completed || !session.async_payment_succeeded){
            savedOrder = order.save();
        }
        order.paymentStatus = "success";
        order.checkoutReceipt = session;
        savedOrder = order.save();

        return res.json({ id: session.id, savedOrder });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Payment failed" });
        }
}

function processCartItems(cartItems) {
    let orderedProducts = [];
    let count = 0;
    let totalAmount = 0;

    while(count !== orders.length){
            for (let product of products) {
                if (cartItems.some(cartItem => cartItem._id === product._id)) {
                    totalAmount += product.price;

                    orderedProducts.push({
                        productId: product._id,
                        title: product.title,
                        price: product.price,
                        quantity: cartProduct.quantity,
                        imeage: product.image
                    });
                }
            }
            count += 1;
        }
        return { orderProducts: orderedProducts,
            totalPrice: totalAmount
    };
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