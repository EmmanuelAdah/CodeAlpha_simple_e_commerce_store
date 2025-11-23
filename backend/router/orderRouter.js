const orderController = require('../controllers/orderController');
const express = require('express');
const router = express.Router();

router.get('/orders/:id', orderController.getOrders);
router.post('/create/order/:id', orderController.getOrders);

module.exports = router;