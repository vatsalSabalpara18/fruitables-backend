const Products = require("../model/product.model");

const listProducts = async (req, res) => {
    try {
        const products = await Products.find();

        if (!products) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Error getting the all products."
            })
        }
        return res.status(200).json({
            success: true,
            data: products,
            message: "get all Products successfully."
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: "Internal server error:" + error.message
        })
    }
}

const getProduct = async (req, res) => {
    try {
        const product = await Products.findById(req.params.id);

        if (!product) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Error getting the product."
            })
        }
        return res.status(200).json({
            success: true,
            data: products,
            message: "Product get successfully."
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: "Internal server error:" + error.message
        })
    }
}

const addProduct = async (req, res) => {
    try {
        const product = await Products.create({...req.body, product_img: req.file.path});

        if(!product){
            return res.status(400).json({
                success: false,
                data: null,
                message: "Error during to create new product."
            })
        }
        return res.status(201).json({
            success: true,
            data: product,
            message: "Your Product is successfully created."
        })
    } catch (error) {        
        res.status(500).json({
            success: false,
            data: null,
            message: "Internal server error:" + error.message
        })
    }
}

const updateProduct = async (req, res) => {
    try {
        const product = await Products.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if (!product) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Error during the update product."
            })
        }
        return res.status(200).json({
            success: true,
            data: product,
            message: "Your Product updated successfully."
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: "Internal server error:" + error.message
        })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const product = await Products.findByIdAndDelete(req.params.id);
       
        if (!product) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Error during the delete product."
            })
        }
        return res.status(200).json({
            success: true,
            data: product,
            message: "Your Product deleted successfully."
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
    listProducts,
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct
}