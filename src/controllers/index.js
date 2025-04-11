const categoryController = require('./category.controller');
const subCategoryController = require('./subcategory.controller');
const productController = require('./product.controller');
const variantController = require('./variant.controller');
const userController = require('./user.controller');
const couponCodeController = require('./couponCode.controller');

module.exports = {
    categoryController,
    subCategoryController,
    productController,
    variantController,
    userController,
    couponCodeController
}