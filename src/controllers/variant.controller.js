const Variants = require("../model/variant.model")

const listVariants = async (req, res) => {
    try {
        const variants = await Variants.find({});
        if (!variants) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Error during the get all variants."
            })
        }

        res.status(200).json({
            success: true,
            data: variants,
            message: "get all variants successfully."
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: "Internal server error:" + error.message
        })
    }
}

const getVariant = async (req, res) => {
    try {
        const variant = await Variants.findById(req.params.variantId);
        if (!variant) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Error during the get variant."
            })
        }

        res.status(200).json({
            success: true,
            data: variant,
            message: "variant get successfully."
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: "Internal server error:" + error.message
        })
    }
}

const createVariant = async (req, res) => {
    try {
        const variant = await Variants.create({...req?.body});

        if (!variant) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Error during create new variant."
            })
        }

        res.status(201).json({
            success: true,
            data: variant,
            message: "new variant is created successfully."
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: "Internal server error:" + error.message
        })
    }
}

const updateVariant = async (req, res) => {
    try {
        const variant = await Variants.findByIdAndUpdate(req.params.id, {...req.body}, { new: true, runValidators: true });

        if (!variant) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Error during the update variant."
            })
        }

        res.status(200).json({
            success: true,
            data: variant,
            message: "variant updated successfully."
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: "Internal server error:" + error.message
        })
    }
}

const deleteVariant = async (req, res) => {
    try {
        const variant = await Variants.findOneAndDelete(req.params.id);
        if (!variant) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Error during the delete variant."
            })
        }        

        res.status(200).json({
            success: true,
            data: variant,
            message: "variant deleted successfully."
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
   listVariants,
   getVariant,
   createVariant,
   updateVariant,
   deleteVariant
}