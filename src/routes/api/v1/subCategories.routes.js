const express = require("express");

const { subCategoryController } = require("../../../controllers");
const upload = require("../../../middleware/upload");
const { SubCategoryValidation } = require("../../../validation");
const validations = require("../../../middleware/validations");
const auth = require("../../../middleware/auth");

const router = express.Router();
const {
  listCategories,
  listCategoryName,
  listInActiveSubCategories,
  getSubcategories,
  getCountActiveSubCategories,
  getSubCategoryWithTotalProducts,
  getSubCategoryWithMostProducts,
  addSubcategory,
  updateSubcategory,
  deleteSubcategory,
} = subCategoryController;

router.get("/list-subcategories", listCategories);

router.get("/list-category-name", listCategoryName);

router.get("/get-subcategories/:cat_Id", getSubcategories);

router.get("/count-active", getCountActiveSubCategories);

router.get("/count-products", getSubCategoryWithTotalProducts);

router.get("/most-products", getSubCategoryWithMostProducts);

router.get("/inactive", listInActiveSubCategories);

router.post(
  "/add-subcategory",
  auth(["admin", "user", "employee"]),
  upload.single("sub_cat_img"),
  validations(SubCategoryValidation.addSubCategory),
  addSubcategory
);

router.put(
  "/update-subcategory/:id",
  auth(["admin", "user", "employee"]),
  upload.single('sub_cat_img'),
  validations(SubCategoryValidation.updateSubCategory),
  updateSubcategory
)

router.delete(
  "/delete-subcategory/:id",
  auth(["admin", "user", "employee"]),
  validations(SubCategoryValidation.getSubCategory),
  deleteSubcategory
);

module.exports = router;
