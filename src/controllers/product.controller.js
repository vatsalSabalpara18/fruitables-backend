const fs = require('fs');
const Products = require("../model/product.model");
const mongoose = require('mongoose');

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

const listProductsWithSubCat = async (req, res) => {
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
        if (!result) {
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
        if (!result) {
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

const getProdcutsByName = async (req, res) => {
    try {        
        const { name } = req.params;

        const result = await Products.find({ name: { $regex: new RegExp(name, "i") } });

        if (!result) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "result is empty."
            })
        }
        res.status(200).json({
            success: true,
            data: result,
            message: "result get successfullly."
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: "Internal server error:" + error.message
        })
    }
}

const getProductBySearch = async (req, res) => {
    try {        
        const matchObj = {};
        const {category, max, min, rating, sortOrder, page, limit} = req.query
        if(category){
            matchObj["category_id"] = parseInt(category);
        }
        if(max || min) {
            matchObj["variants.price"] = {}
        }        
        if(max){
            matchObj["variants.price"]["$lte"] = parseFloat(max)
        }
        if(min){
            matchObj["variants.price"]["$gte"] = parseFloat(min)
        }
        if(rating){
            matchObj["avgProductRating"] = { $gte: parseFloat(rating) }
        }        
                
        // {
        //     category_id: 1,
        //         avgProductRating: { $gt: 4 },
        //     "variants.price": { $gt: 1000 },
        //     "variants.price": { $lt: 2000 }
        // }
        const pipeline = [
            {
                $lookup: {
                    from: "review",
                    localField: "_id",
                    foreignField: "product_id",
                    as: "reviews"
                }
            },
            {
                $lookup: {
                    from: "variant",
                    localField: "_id",
                    foreignField: "product_id",
                    as: "variants"
                }
            },
            {
                $unwind: "$reviews"
            },
            {
                $unwind: "$variants"
            },
            {
                $group: {
                    _id: "$_id",
                    avgProductRating: {
                        $avg: "$reviews.rating"
                    },
                    name: { $first: "$name" },
                    category_id: { $first: "$category_id" },
                    description: { $first: "$description" },
                    variants: {
                        $push: {
                            price: "$variants.attributes.Price"
                        }
                    }
                }
            },
            {
                $match: matchObj
            },
            {
                $sort: {
                    "name": parseInt(sortOrder)
                }
            }
        ];
        if(page && limit){
            pipeline.push({
                "$skip": (parseInt(page) - 1) * parseInt(limit)
            })
            pipeline.push({
                "$limit": parseInt(limit)
            })
        }
        const result = await Products.aggregate(
            pipeline
        )
        if (!result || !result.length){
           return res.status(400).json({
                success: false,
                data: [],
                message: "result is get empty."
            })
        }
       return res.status(200).json({
            success: true,
            data: result,
            message: "result get successfully."
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: "Internal server error:" + error.message
        })
    }
}

const listProductsByCategory = async (req, res) => {
    try {
        const { category_id } = req.params;

        const result = await Products.find({ category: category_id});

        if (!result) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "result is empty."
            })
        }
        res.status(200).json({
            success: true,
            data: result,
            message: "result get successfullly."
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: "Internal server error:" + error.message
        })
    }
}
const listProductsBySubCategory = async (req, res) => {
    try {
        const { subcategory_id } = req.params;

        const result = await Products.find({ sub_category: subcategory_id });

        if (!result) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "result is empty."
            })
        }
        res.status(200).json({
            success: true,
            data: result,
            message: "result get successfullly."
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: "Internal server error:" + error.message
        })
    }
}

const getVariantDetails = async (req, res) => {
    try {

        const { product_id } = req.params;

        const result = await Products.aggregate(
            [
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(product_id)
                    }
                },
                {
                    $lookup: {
                        from: "variants",
                        localField: "_id",
                        foreignField: "product_id",
                        as: "variants"
                    }
                },
                {
                    $unwind: "$variants"
                }
            ]
        )

        if(!result){
            return res.status(400).json({
                success: true,
                data: result,
                message: "result get empty."
            })
        }

        return res.status(200).json({
            success: true,
            data: result,
            message: "result get sucessfully."
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: "Intrenal Server Error " + error
        })
    }
}

const addProduct = async (req, res) => {
    try {
        const product = await Products.create({ ...req.body, product_img: req.file.path });

        if (!product) {
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
        if (req.file) {
            const oldProduct = await Products.findById(req.params.id);

            if (oldProduct?.product_img) {
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

            modifiedBody = { ...req.body, product_img: req.file.path };
        } else {
            modifiedBody = { ...req.body }
        }
        const product = await Products.findByIdAndUpdate(req.params.id, modifiedBody, { new: true, runValidators: true });
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
            if (err) {
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
    listProductsByCategory,
    listProductsBySubCategory,
    getVariantDetails,
    getProductBySearch,
    getProduct,
    getProdcutsByName,
    addProduct,
    updateProduct,
    deleteProduct
}