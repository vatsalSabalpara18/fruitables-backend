const express = require('express');
const { productController } = require('../../../controllers');
const upload = require('../../../middleware/upload');
const validations = require('../../../middleware/validations');
const { productValidation } = require('../../../validation');
const auth = require('../../../middleware/auth');

const { listProducts, listProductsWithSubCat, listProductsCategoryWise, listProductsByCategory, listProductsBySubCategory, getVariantDetails, getProductBySearch, getProduct, getProdcutsByName, addProduct, updateProduct, deleteProduct } = productController;

const router = express.Router();

router.get('/list-products', listProducts);
router.get('/list-products-category-subcategory', listProductsWithSubCat)
router.get('/list-products-category-wise', listProductsCategoryWise)
router.get(
    '/get-product/:id',
    validations(productValidation.getProduct),
    getProduct
);
router.get('/search/:name', getProdcutsByName);
router.get('/search/data', getProductBySearch);
router.get('/list/category/:category_id', listProductsByCategory);
router.get('/list/subcategory/:subcategory_id', listProductsBySubCategory);
router.get('/variant-details/:product_id', getVariantDetails)
router.post(
    '/add-product',
    auth(["admin", "user", "employee"]),
    upload.single('product_img'),
    validations(productValidation.addProduct),
    addProduct
);
router.put(
    '/update-product/:id',
    auth(["admin", "user", "employee"]),
    upload.single('product_img'),
    validations(productValidation.updateProduct),
    updateProduct
);
router.delete(
    '/delete-product/:id',
    auth(["admin", "user", "employee"]),
    validations(productValidation.getProduct),
    deleteProduct
);

module.exports = router;