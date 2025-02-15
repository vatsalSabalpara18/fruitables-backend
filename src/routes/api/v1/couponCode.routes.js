const express = require("express");
const { couponCodeController } = require("../../../controllers");

const { listCouponCodes, addCouponCode, updateCouponCode, deleteCouponCode } = couponCodeController

const router = express.Router();

router.get("/list-coupon-code", listCouponCodes);
router.post("/add-coupon-code", addCouponCode);
router.put("/update-coupon-code/:id", updateCouponCode);
router.delete("/delete-coupon-code/:id", deleteCouponCode);

module.exports = router