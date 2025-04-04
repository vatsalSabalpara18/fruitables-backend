const fs = require('fs');
const Categories = require("../model/category.model");
const Products = require('../model/product.model');
const SubCategories = require('../model/subCategory.model');
const { default: mongoose } = require('mongoose');

const listCategories = async (req, res) => {
    try {
        const categories = await Categories.find();
        if (!categories) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Error during the get all categories."
            })
        }

        res.status(200).json({
            success: true,
            data: categories,
            message: "get all categories successfully."
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: "Internal server error:" + error.message
        })
    }
}

const getTotalCategory = async (req, res) => {
    try {
        const result = await Categories.aggregate(
            [
                {
                    $count: 'no of categories'
                }
            ]
        )
        if(!res) {
            return res.status(400).json({
                sucess: false,
                data: [],
                message: "no of categoies not found."
            })
        }
        return res.status(200).json({
            sucess: true,
            data: result,
            message: "found no. of categories."
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: "Internal server error:" + error.message
        })
    }
}

const getCategory = async (req, res) => {
    try {
        const category = await Categories.findById(req.params.id);
        if (!category) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Error during the get category."
            })
        }

        res.status(200).json({
            success: true,
            data: category,
            message: "category get successfully."
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: "Internal server error:" + error.message
        })
    }
}

const getCountActive = async (req, res) => {
    try {
        
        const result = await Categories.aggregate(
            [
                {
                    $match: {
                        isActive: true
                    }
                },
                {
                    $count: 'No of Active Categories'
                }
            ]
        );

        if(!result){
            return res.status(400).json({
                success: false,
                data: [],
                message: "result get empty."
            }) 
        }

        res.status(200).json({
            success: true,
            data: result,
            message: "get result successfully."
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: "Internal server error:" + error.message
        })
    }
}

const getMostProducts = async (req, res) => {
    try {

        const result = await Products.aggregate(
            [
                {
                    $group: {
                        _id: "$category",
                        No_of_products: {
                            $sum: 1
                        }
                    }
                },
                {
                    $sort: {
                        No_of_products: -1
                    }
                },
                {
                    $limit: 1
                },
                {
                    $lookup: {
                        from: "categories",
                        localField: "_id",
                        foreignField: "_id",
                        as: "categoryName",
                        pipeline: [
                            {
                                $project: {
                                    name: 1,
                                    _id: 0
                                }
                            }
                        ]
                    }
                },
                {
                    $project: {
                        No_of_products: 1,
                        categoryName: { $first: "$categoryName.name" }
                    }
                }
            ]
        );

        if (!result) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "result get empty."
            })
        }

        res.status(200).json({
            success: true,
            data: result,
            message: "get result successfully."
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: "Internal server error:" + error.message
        })
    }
}

const getAverageProducts = async (req, res) => {
    try {

        const total_product = await Products.countDocuments({});
        const result = await Products.aggregate(
            [
                {
                    $group: {
                        _id: "$category",
                        No_of_products: {
                            $sum: 1
                        }
                    }
                },
                {
                    $lookup: {
                        from: "categories",
                        localField: "_id",
                        foreignField: "_id",
                        as: "categoryName",
                        pipeline: [
                            {
                                $project: {
                                    name: 1,
                                    _id: 0
                                }
                            }
                        ]
                    }
                },
                {
                    $project: {
                        No_of_products: 1,
                        categoryName: { $first: "$categoryName.name" }
                    }
                }
            ]
        );

        const new_res = result.map((item) => {
            const percentage =  +((item.No_of_products / total_product ) * 100).toFixed(2)
            return {
                ...item,
                percentage
            }
        })

        if (!result) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "result get empty."
            })
        }

        res.status(200).json({
            success: true,
            data: new_res,
            message: "get result successfully."
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: "Internal server error:" + error.message
        })
    }
}

const getInActiveCategories = async (req, res) => {
    try {

        const result = await Categories.aggregate(
            [
                {
                    $match: {
                        isActive: false
                    }
                }
            ]
        );

        if (!result) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "result get empty."
            })
        }

        res.status(200).json({
            success: true,
            data: result,
            message: "get result successfully."
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: "Internal server error:" + error.message
        })
    }
}

const getCountOfSubcategoriesByEachCategories = async (req, res) => {
    try {

        const result = await SubCategories.aggregate(
            [
                {
                    $group: {
                        _id: "$category",
                        no_of_subcategory: {
                            $sum: 1
                        }
                    }
                },
                {
                    $lookup: {
                        from: "categories",
                        localField: "_id",
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
                    $project: {
                        no_of_subcategory: 1,
                        categoryName: {
                            $first: "$categoryName.name"
                        }
                    }
                }
            ]
        );

        if (!result) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "result get empty."
            })
        }

        res.status(200).json({
            success: true,
            data: result,
            message: "get result successfully."
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: "Internal server error:" + error.message
        })
    }
}

const getSubCatgoriesByCategory = async (req, res) => {
    try {
        const result = await Categories.aggregate(
            [
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(req?.params?.category_id || "")
                    }
                },
                {
                    $lookup: {
                        from: "subcategories",
                        localField: "_id",
                        foreignField: "category",
                        as: "subcategories",
                        pipeline: [
                            {
                                $project: {
                                    name: 1,
                                    subCat_id: "$_id",
                                    _id: 0
                                }
                            }
                        ]
                    }
                }
            ]
        );

        if (!result) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "result get empty."
            })
        }

        res.status(200).json({
            success: true,
            data: result,
            message: "get result successfully."
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: "Internal server error:" + error.message
        })
    }
}

const addCategory = async (req, res) => {
    try {
        const category = await Categories.create({...req.body, cat_img: req.file.path, isActive: true});

        if(!category){
            return res.status(400).json({
                success: false,
                data: [],
                message: "Error during create new category."
            })
        }

        res.status(201).json({
            success: true,
            data: category,
            message: "new category is created successfully."
        })

    } catch (error) {        
        res.status(500).json({
            success: false,
            data: null,
            message: "Internal server error:" + error.message
        })
    }
}

const updateCategory = async (req, res) => {
    try {
        let updatedBody;
        const getOldCategory = await Categories.findById(req.params.id);
        if(req.file){
            updatedBody = {...req.body, cat_img: req.file.path};
            fs.unlink(getOldCategory.cat_img.replaceAll("\\", "/"), (err) => {
                if(err){
                    return res.status(400).json({
                        success: false,
                        data: null,
                        message: "Error in delete old image during the update category: " + err
                    })
                }
            })
        } else {
            updatedBody =  {...req.body}
        }
        const category = await Categories.findByIdAndUpdate(req.params.id, updatedBody, { new: true, runValidators: true });

        if (!category) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Error during the update category."
            })
        }

        res.status(200).json({
            success: true,
            data: category,
            message: "category updated successfully."
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: "Internal server error:" + error.message
        })
    }
}

const deleteCategory = async (req, res) => {
    try {
        const category = await Categories.findOneAndDelete(req.params.id);
        if (!category) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Error during the delete category."
            })
        }        

        fs.unlink(category.cat_img, (err) => {
            if(err) {
                return res.status(400).json({
                    success: false,
                    data: null,
                    messsage: "Error in delete category image: " + err
                })
            }
        });

        res.status(200).json({
            success: true,
            data: category,
            message: "category deleted successfully."
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
    listCategories,
    getCategory,
    getCountActive,
    getTotalCategory,
    getMostProducts,
    getAverageProducts,
    getInActiveCategories,
    getCountOfSubcategoriesByEachCategories,
    getSubCatgoriesByCategory,
    addCategory,
    updateCategory,
    deleteCategory
}