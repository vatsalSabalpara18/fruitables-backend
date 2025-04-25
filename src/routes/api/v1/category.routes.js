const express = require("express");

const { categoryController } = require("../../../controllers");
const upload = require("../../../middleware/upload");
const auth = require("../../../middleware/auth");
const validations = require("../../../middleware/validations");
const { CatgoryValidation } = require("../../../validation");

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

router.get(
  "/get-category/:id",
  validations(CatgoryValidation.getCategory),
  getCategory
);

router.get("/most-products", getMostProducts);

router.get("/average-products", getAverageProducts);

router.get("/inactive", getInActiveCategories);

router.get("/count-subcategories", getCountOfSubcategoriesByEachCategories);

router.get("/category-subcategory/:category_id", getSubCatgoriesByCategory);

router.post(
  "/add-category",
  auth(["admin", "user", "employee"]),
  upload.single("cat_img"),
  validations(CatgoryValidation.addCategory),
  addCategory
);

router.put(
  "/update-category/:id",
  auth(["admin", "user", "employee"]),
  upload.single("cat_img"),
  validations(CatgoryValidation.updateCategory),
  updateCategory
);

router.delete(
  "/delete-category/:id",
  auth(["admin", "user", "employee"]),
  validations(CatgoryValidation.getCategory),
  deleteCategory
);

router.get("/total-cat", getTotalCategory);

module.exports = router;
