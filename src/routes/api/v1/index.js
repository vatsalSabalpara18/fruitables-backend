const express = require('express');

const categoriesRouter = require('./category.routes');
const subCategoriesRouter = require("./subCategories.routes");
const productsRouter = require('./product.routes');

const router = express.Router();

router.use("/categories", categoriesRouter);
router.use("/sub-categories", subCategoriesRouter);
router.use("/products", productsRouter);

module.exports = router;