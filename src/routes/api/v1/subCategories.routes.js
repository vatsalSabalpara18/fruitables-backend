const express = require("express");

const { subCategoryController } = require("../../../controllers");
const upload = require("../../../middleware/upload");

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

router.post("/add-subcategory", upload.single("sub_cat_img"), addSubcategory);

router.put("/update-subcategory/:id", upload.single('sub_cat_img') , updateSubcategory)

router.delete("/delete-subcategory/:id", deleteSubcategory);

module.exports = router;
