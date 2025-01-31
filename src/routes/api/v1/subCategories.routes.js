const express = require('express');

const { subCategoryController } = require('../../../controllers');
const upload = require('../../../middleware/upload');

const router = express.Router();
const { getSubcategories, addSubcategory, updateSubcategory, deleteSubcategory } = subCategoryController

router.get("/get-subcategories", getSubcategories)

router.post("/add-subcategory", upload.single('sub_cat_img') ,addSubcategory)

router.put("/update-subcategory/:id", updateSubcategory)

router.delete("/delete-subcategory/:id", deleteSubcategory)

module.exports = router;