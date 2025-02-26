const fs = require('fs');
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

const listProductsWithSubCat = async(req, res) => {
    try {
        const result = await Products.aggregate(
            [
                {
                    $lookup: {
                        from: "categories",
                        localField: "category",
                        foreignField: "_id",
                        as: "categoryName",
                        pipeline: [
                            {
                                $project: {
                                    name: 1
                                }
                            }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: "subcategories",
                        localField: "sub_category",
                        foreignField: "_id",
                        as: "sub_categoryName",
                        pipeline: [
                            {
                                $project: {
                                    name: 1
                                }
                            }
                        ]
                    }
                },
                {
                    $project: {
                        name: 1,
                        categoryName: { $first: "$categoryName.name" },
                        sub_categoryName: { $first: "$sub_categoryName.name" }
                    }
                }
            ]
        )
        if(!result){
            return res.status(400).json({
                success: false,
                data: null,
                message: "result is empty."
            })
        }
        res.status(200).json({
            success: true,
            data: result,
            message: "result is get successfully."
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: "Internal server error:" + error.message
        })
    }
}

const listProductsCategoryWise = async (req, res) => {
    try {
        const result = await Products.aggregate(
            [
                {
                    $group: {
                        _id: "$category",
                        no_products: { $sum: 1 }
                    }
                },
                {
                    $lookup: {
                        from: "categories",
                        localField: "_id",
                        foreignField: "_id",
                        as: "categoryName"
                    }
                },
                {
                    $project: {
                        cat_id: "$_id",
                        categoryName: { $arrayElemAt: ["$categoryName.name", 0] },
                        no_products: 1,
                        _id: 0
                    }
                }
            ]

        )
        if(!result){
            return res.status(400).json({
                success: false,
                data: [],
                message: "the result is empty."
            })
        }
        res.status(200).json({
            success: true,
            data: result,
            message: "result is get successfully."
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
            data: product,
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
        let modifiedBody;
        if(req.file){
            const oldProduct = await Products.findById(req.params.id);            

            if (oldProduct?.product_img){
                fs.unlinkSync(oldProduct?.product_img, (err) => {
                    if (err) {
                        return res.status(400).json({
                            success: false,
                            data: null,
                            message: "Error during the delete old product image."
                        })
                    }
                }) 
            }

            modifiedBody = { ...req.body, product_img: req.file.path};
        } else {
            modifiedBody = { ...req.body }
        }
        const product = await Products.findByIdAndUpdate(req.params.id, modifiedBody, { new: true, runValidators: true});
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

    
        fs.unlinkSync(product.product_img, (err) => {
            if(err) {
                return res.status(400).json({
                    success: false,
                    data: null,
                    message: "Error during the delete product image."
                })
            }
        })        

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
    listProductsWithSubCat,
    listProductsCategoryWise,
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct
}