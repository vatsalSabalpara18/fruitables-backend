const SubCategories = require("../model/subCategory.model");

const getSubcategories = (req, res) => {
    try {
        res.send("GET Request");
    } catch (error) {
        console.error(error)
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

const updateSubcategory = (req, res) => {
    try {
        console.log(req.body);
        console.log(req.params);
        res.send("PUT Request");
    } catch (error) {
        console.error(error)
    }
}

const deleteSubcategory = (req, res) => {
    try {
        console.log(req.body);
        console.log(req.params);
        res.send("DELETE Request");
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    getSubcategories,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory
}