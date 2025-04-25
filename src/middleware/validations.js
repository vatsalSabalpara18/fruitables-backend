const Joi = require("joi");
const pick = require("../helper/helper");

const validations = ( schema ) => async (req, res, next) => {
    try {

        // console.log(schema, req, Object.keys(schema));

        const object = pick(req, Object.keys(schema));        

        const { value, error } = await Joi
            .compile(schema)
            .prefs({
                abortEarly: false
            })
            .validate(object)

        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                details: error.details.map(v => v.message).join(','),
            });
        }

        Object.assign(req, value);

        next();
           
    } catch (error) {        
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error ' + error.message
        })
    }
}

module.exports = validations