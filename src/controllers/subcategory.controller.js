const fs = require('fs');
const SubCategories = require("../model/subCategory.model");
const Products = require('../model/product.model');
const { uploadFileWithCloudinary, deleteFileWithCloudinary } = require('../utils/clouldnairy');

const listCategories = async (req, res) => {
    try {
        const list_categories = await SubCategories.find({});
        if (!list_categories) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Error in get all subcategories"
            })
        }

        return res.status(200).json({
            message: true,
            data: list_categories,
            message: "subcategoires list get"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: "internal server error: " + error.message
        })
    }
}

const listCategoryName = async (req, res) => {
    try {
        const result = await SubCategories.aggregate(
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
                    $project: {
                        name: 1,
                        category: 1,
                        categoryName: { $first: "$categoryName.name" }
                    }
                }
            ]
        )
        if (!result) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "result is empty"
            })
        }
        res.status(200).json({
            success: true,
            data: result,
            message: "result get successfully."
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: "internal server error: " + error.message
        })
    }
}

const getSubcategories = async (req, res) => {
    try {
        const subCategories = await SubCategories.find({ category: req.params.cat_Id }).exec();
        if (!subCategories) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Error in get subcategories data."
            })
        }

        return res.status(200).json({
            success: true,
            data: subCategories,
            message: "subcategories is getting successfully."
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: "Internal server Error: " + error.message
        })
    }
}

const getCountActiveSubCategories = async (req, res) => {
    try {
        const result = await SubCategories.aggregate(
            [
                {
                    $match: {
                        isActive: true
                    }
                },
                {
                    $count: 'NoOfActiveSubCategories'
                }
            ]
        )
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
            message: "result get successfully."
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: "Internal server Error: " + error.message
        })
    }
}

const listInActiveSubCategories = async (req, res) => {
    try {
        const result = await SubCategories.aggregate(
            [
                {
                    $match: {
                        isActive: false
                    }
                }
            ]
        )
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
            message: "result get successfully."
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: "Internal server Error: " + error.message
        })
    }
}

const getSubCategoryWithTotalProducts = async (req, res) => {
    try {
        const result = await Products.aggregate(
            [
                {
                    $group: {
                        _id: "$sub_category",
                        no_of_products: {
                            $sum: 1
                        }
                    }
                },
                {
                    $lookup: {
                        from: "subcategories",
                        localField: "_id",
                        foreignField: "_id",
                        as: "sub_categoryName",
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
                        no_of_products: 1,
                        sub_categoryName: { $first: "$sub_categoryName.name" }
                    }
                }
            ]
        )
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
            message: "result get successfully."
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: "Internal server Error: " + error.message
        })
    }
}

const getSubCategoryWithMostProducts = async (req, res) => {
    try {
        const result = await Products.aggregate(
            [
                {
                    $group: {
                        _id: "$sub_category",
                        no_of_products: {
                            $sum: 1
                        }
                    }
                },
                {
                    $lookup: {
                        from: "subcategories",
                        localField: "_id",
                        foreignField: "_id",
                        as: "sub_categoryName",
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
                        no_of_products: 1,
                        sub_categoryName: { $first: "$sub_categoryName.name" }
                    }
                },
                {
                    $sort: {
                        no_of_products: -1
                    }
                }
            ]
        )
        const max_no_of_products = result.reduce((acc, item) => {
            if (item?.no_of_products > acc) {
                acc = item?.no_of_products
            }
            return acc;
        }, 0)

        if (!result) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "result get empty."
            })
        }
        res.status(200).json({
            success: true,
            data: result.filter((item) => item?.no_of_products === max_no_of_products),
            message: "result get successfully."
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: "Internal server Error: " + error.message
        })
    }
}

const addSubcategory = async (req, res) => {
    try {
        const image = await uploadFileWithCloudinary(req.file.path, "sub_categories_img");
        const subCategory = await SubCategories.create({ ...req.body, sub_cat_img: { url: image.url, public_id: image.public_id } });

        if (!subCategory) {
            return res.status(400).json({
                success: false,
                data: [],
                message: "Error during to create new subCategory."
            })
        }

        return res.status(201).json({
            success: true,
            data: subCategory,
            message: "new subCategory is created successfully."
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            data: [],
            message: "Internal Server Error: " + error.message
        })
    }
}

const updateSubcategory = async (req, res) => {
    try {
        let updateBody;
        if (req.file) {
            const oldSubCategory = await SubCategories.findById(req.params.id);
            const deleteRes = await deleteFileWithCloudinary(oldSubCategory?.sub_cat_img?.public_id);
            // fs.unlinkSync(oldSubCategory.sub_cat_img, (err) => {
            //     if(err){
            //         return res.status(400).json({
            //             success: false,
            //             data: null,
            //             message: "Error in delete old subcategory image."                        
            //         })
            //     }
            // })

            if (deleteRes.result == 'ok') {
                const newImage = await uploadFileWithCloudinary(req.file.path, "sub_categories_img");
                updateBody = { ...req.body, sub_cat_img: { url: newImage?.url, public_id: newImage?.public_id } };
            }

        } else {
            updateBody = { ...req.body };
        }

        const subCategory = await SubCategories.findByIdAndUpdate(req.params.id, updateBody, { new: true, runValidators: true });

        if (!subCategory) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Error in update subcategory"
            })
        }

        return res.status(200).json({
            success: true,
            data: subCategory,
            message: "subcategory updated successfully."
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: "internal server error: " + error.message
        })
    }
}

const deleteSubcategory = async (req, res) => {
    try {
        const subCategory = await SubCategories.findByIdAndDelete(req.params.id);
        if (!subCategory) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Error in delete subcategory."
            })
        }

        const deleteRes = await deleteFileWithCloudinary(subCategory?.sub_cat_img?.public_id);

        // fs.unlinkSync(subCategory.sub_cat_img, (err) => {
        //     if(err){
        //         return res.status(400).json({
        //             success: false,
        //             data: null,
        //             message: "Error in delete the image file."
        //         })
        //     }
        // })

        if (deleteRes.result !== 'ok') {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Error in delete the image file."
            })
        }

        return res.status(200).json({
            success: true,
            data: subCategory,
            message: "subCategory deleted successfully."
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: "Internal server error: " + error.message
        })
    }
}

module.exports = {
    listCategories,
    listCategoryName,
    listInActiveSubCategories,
    getSubCategoryWithTotalProducts,
    getSubCategoryWithMostProducts,
    getSubcategories,
    getCountActiveSubCategories,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory
}