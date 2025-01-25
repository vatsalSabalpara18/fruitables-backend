const express = require('express');

const { subCategoryController } = require('../../../controllers');

const router = express.Router();
const { getSubcategories, addSubcategory, updateSubcategory, deleteSubcategory } = subCategoryController

router.get("/get-subcategories", getSubcategories)

router.post("/add-subcategory", addSubcategory)

router.put("/update-subcategory/:id", updateSubcategory)

router.delete("/delete-subcategory/:id", deleteSubcategory)

module.exports = router;