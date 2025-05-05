const Joi = require("joi");

const addProduct = {
    body: Joi.object().keys({
        name: Joi.string().required().trim(),
        category: Joi.string().required().trim(),
        sub_category: Joi.string().required().trim(),
        description: Joi.string().required().trim(),
        price: Joi.number().required()
    })
}

const updateProduct = {
    params: Joi.object().keys({
        id: Joi.string().required().trim()
    }),
    body: Joi.object().keys({
        name: Joi.string().required().trim(),
        category: Joi.string().required().trim(),
        sub_category: Joi.string().required().trim(),
        description: Joi.string().required().trim(),
        price: Joi.number().required(),
        product_img: Joi.object()
    })
}

const getProduct = {
    params: Joi.object().keys({
        id: Joi.string().required().trim()
    })
}

module.exports = {
    addProduct,
    updateProduct,
    getProduct
}