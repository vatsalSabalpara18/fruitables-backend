const express = require('express');

const categoriesRouter = require('./category.routes');
const subCategoriesRouter = require("./subCategories.routes");
const productsRouter = require('./product.routes');
const variantRouter = require('./variant.routes');
const couponCodeRouter = require('./couponCode.routes');

const router = express.Router();

router.use("/categories", categoriesRouter);
router.use("/sub-categories", subCategoriesRouter);
router.use("/products", productsRouter);
router.use("/variant", variantRouter);
router.use("/coupon-code", couponCodeRouter);

module.exports = router;