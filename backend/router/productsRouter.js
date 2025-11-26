const express = require('express');
const router = express.Router();
const productController = require('../controllers/productsController');

router.get('/', productController.getProducts);
router.post('/add/product', productController.addProduct);
router.get('/get/product/:id', productController.getProductById);
router.delete('/product/delete/:id', productController.deleteById);
router.delete('/products/delete/all', productController.deleteAll);
router.patch('/update/product/:id', productController.updateProduct);

module.exports = router;