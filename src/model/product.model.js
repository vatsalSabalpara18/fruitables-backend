const { Schema, model, Types } = require("mongoose");

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    category: {
        type: Types.ObjectId,
        ref: 'Categories',
        required: true,
    },
    sub_category: {
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
        type: {
            url: String,
            public_id: String
        },
        required: true
    },
    isActive: {
        type: Boolean,
        default: true,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})

const Products = new model('Products', productSchema);

module.exports = Products;