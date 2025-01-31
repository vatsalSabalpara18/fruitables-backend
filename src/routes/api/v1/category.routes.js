const express = require("express");

const { categoryController } = require("../../../controllers");
const upload = require("../../../middleware/upload")

const router = express.Router();
const { listCategories, getCategory, addCategory, updateCategory, deleteCategory } = categoryController;

router.get("/list-categories", listCategories);

router.get("/get-category/:id", getCategory);

router.post("/add-category", upload.single("cat_img"), addCategory);

router.put("/update-category/:id", upload.single("cat_img") , updateCategory);

router.delete("/delete-category/:id", deleteCategory);

module.exports = router;