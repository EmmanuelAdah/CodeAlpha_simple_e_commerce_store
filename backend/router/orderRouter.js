const orderController = require('../controllers/orderController');
const express = require('express');
const router = express.Router();

router.get('/get/:id', orderController.getOrders);
router.post('/create/:id', orderController.getOrders);
router.get('/check/status/:id', orderController.checkStatus)

module.exports = router;