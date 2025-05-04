const Joi = require("joi");

const addSubCategory = {
    body: Joi.object().keys({
        name: Joi.string().required().trim(),
        category: Joi.string().required().trim(),
        description: Joi.string().required().trim()
    })
}

const updateSubCategory = {
    params: Joi.object().keys({
        id: Joi.string().required().trim()
    }),
    body: Joi.object().keys({
        name: Joi.string().required().trim(),
        category: Joi.string().required().trim(),
        description: Joi.string().required().trim(),
        sub_cat_img: Joi.object()
    })
}

const getSubCategory = {
    params: Joi.object().keys({
        id: Joi.string().required().trim()
    })
}

module.exports = {
    addSubCategory,
    updateSubCategory,
    getSubCategory
}