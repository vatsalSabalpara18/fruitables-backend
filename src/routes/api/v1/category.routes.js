const express = require("express");

const { categoryController } = require("../../../controllers");
const upload = require("../../../middleware/upload");

const router = express.Router();
const {
  listCategories,
  getTotalCategory,
  getMostProducts,
  getCategory,
  getCountActive,
  getAverageProducts,
  getInActiveCategories,
  getCountOfSubcategoriesByEachCategories,
  getSubCatgoriesByCategory,
  addCategory,
  updateCategory,
  deleteCategory,
} = categoryController;

router.get("/list-categories", listCategories);

router.get("/count-active", getCountActive);

router.get("/get-category/:id", getCategory);

router.get("/most-products", getMostProducts);

router.get("/average-products", getAverageProducts);

router.get("/inactive", getInActiveCategories);

router.get("/count-subcategories", getCountOfSubcategoriesByEachCategories);

router.get("/category-subcategory/:category_id", getSubCatgoriesByCategory);

router.post("/add-category", upload.single("cat_img"), addCategory);

router.put("/update-category/:id", upload.single("cat_img"), updateCategory);

router.delete("/delete-category/:id", deleteCategory);

router.get("/total-cat", getTotalCategory);

module.exports = router;
