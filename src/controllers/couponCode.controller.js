const couponCode = require("../model/couponCode.model");

const listCouponCodes = async (req, res) => {
    try {
        const coupon = await couponCode.find({});

        if(!coupon) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Error during getting all coupon codes."
            })
        }

        res.status(200).json({
            success: true,
            data: coupon,
            message: "successfully geting all coupon codes."
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: "Internal server error:" + error.message
        })
    }
}

const addCouponCode = async (req, res) => {
    try {
        const coupon = await couponCode.create(req.body);

        if(!coupon){
            res.status(400).json({
                success: false,
                data: null,
                message: "error during the creating new coupon code"
            })
        }

        res.status(201).json({
            success: true,
            data: coupon,
            message: "new coupon code created successfully."
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: "Internal server error:" + error.message
        })
    }
}

const updateCouponCode = async (req, res) => {
    try {
        const coupon = await couponCode.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true});
        if(!coupon){
            return res.status(400).json({
                success: false,
                data: null,
                message: "Error during update coupon code"
            })
        }

        res.status(200).json({
            success: true,
            data: coupon,
            message: "successfully update the coupon code"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: "Internal server error:" + error.message
        })
    }
}

const deleteCouponCode = async (req, res) => {
    try {
        const coupon = await couponCode.findOneAndDelete(req.params.id);
        if(!coupon){
            return res.status(400).json({
                success: false,
                data: null,
                message: "Error during delete couponCode"
            })
        }

        res.status(200).json({
            success: true,
            data: coupon,
            message: "successfully deleted coupon code"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: "Internal server error:" + error.message
        })
    }
}

module.exports = {
    listCouponCodes,
    addCouponCode,
    updateCouponCode,
    deleteCouponCode    
}