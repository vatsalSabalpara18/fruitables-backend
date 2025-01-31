const { Schema, model, Types } = require("mongoose");

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    sub_category_id: {
        type: Types.ObjectId,
        ref: 'SubCategories',
        required: true,
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,        
    },
    product_img: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})

const Products = new model('Products', productSchema);

module.exports = Products;