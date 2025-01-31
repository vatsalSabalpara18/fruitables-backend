const fs = require('fs');
const Categories = require("../model/category.model");

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

const addCategory = async (req, res) => {
    try {
        const category = await Categories.create({...req.body, cat_img: req.file.path});

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

        console.log("cateImg", category);

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
    addCategory,
    updateCategory,
    deleteCategory
}