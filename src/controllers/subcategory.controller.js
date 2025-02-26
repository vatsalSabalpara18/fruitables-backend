const fs = require('fs');
const SubCategories = require("../model/subCategory.model");

const listCategories = async (req, res) => {
    try {
        const list_categories = await SubCategories.find({});
        if(!list_categories){
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
            message: "internal server error: "+ error.message
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
        if (!result){
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
        if(!subCategories){
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
            message: "Internal server Error: "+ error.message
        })
    }
}

const addSubcategory = async (req, res) => {
    try {        
        const subCategory = await SubCategories.create({...req.body, sub_cat_img: req.file.path});

            if(!subCategory){
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
        if(req.file){
            const oldSubCategory = await SubCategories.findById(req.params.id);

            fs.unlinkSync(oldSubCategory.sub_cat_img, (err) => {
                if(err){
                    return res.status(400).json({
                        success: false,
                        data: null,
                        message: "Error in delete old subcategory image."                        
                    })
                }
            })

            updateBody = { ...req.body, sub_cat_img: req.file.path };
        } else {
            updateBody = { ...req.body };
        }

        const subCategory = await SubCategories.findByIdAndUpdate(req.params.id, updateBody, { new: true, runValidators: true });

        if(!subCategory){
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
        if(!subCategory){
            return res.status(400).json({
                success: false,
                data: null,
                message: "Error in delete subcategory."
            })
        }

        fs.unlinkSync(subCategory.sub_cat_img, (err) => {
            if(err){
                return res.status(400).json({
                    success: false,
                    data: null,
                    message: "Error in delete the image file."
                })
            }
        })

        return res.status(200).json({
            success: true,
            data: subCategory,
            message: "subCategory deleted successfully."
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            message: "Internal server error: "+ error.message
        })
    }
}

module.exports = {
    listCategories,
    listCategoryName,
    getSubcategories,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory
}