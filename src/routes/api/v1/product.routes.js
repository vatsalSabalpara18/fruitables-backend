const express = require('express');
const { productController } = require('../../../controllers');
const upload = require('../../../middleware/upload');

const { listProducts,getProduct, addProduct, updateProduct, deleteProduct } = productController;

const router = express.Router();

router.get('/list-products', listProducts);
router.get('/get-product/:id', getProduct);
router.post('/add-product', upload.single('product_img') ,addProduct);
router.put('/update-product/:id', upload.single('product_img'), updateProduct);
router.delete('/delete-product/:id', deleteProduct);

module.exports = router;