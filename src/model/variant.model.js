const { Schema, model, Types } = require("mongoose");

const variantSchema = new Schema({
    product_id: {
        type: Types.ObjectId,
        ref: 'Products',
        required: true,
    },    
    attributes: {
        type: Object,
        required: true,        
    },
    isActive: {
        type: Boolean,
        required: true,
    }    
}, {
    timestamps: true,
    versionKey: false
})

const Variants = new model('Variants', variantSchema);

module.exports = Variants;