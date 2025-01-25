const express = require('express');

const { categoryController } = require('../../../controllers');

const router = express.Router();
const { getCategories, addCategory, updateCategory, deleteCategory } = categoryController

router.get("/get-categories", getCategories);

router.post("/add-category", addCategory)

router.put("/update-category/:id", updateCategory)

router.delete("/delete-category/:id", deleteCategory)

module.exports = router;