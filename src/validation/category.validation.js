const Joi = require("joi");

const addCategory = {
    body: Joi.object().keys({
        name: Joi.string().required().trim(),
        description: Joi.string().required().trim()        
    })
}

const updateCategory = {
    params: Joi.object().keys({
        id: Joi.string().required().trim()
    }),
    body: Joi.object().keys({
        name: Joi.string().required().trim(),
        description: Joi.string().required().trim()        
    })
}

const getCategory = {
    params: Joi.object().keys({
        id: Joi.string().required().trim()
    })
}

module.exports = {
    addCategory,
    updateCategory,
    getCategory
}