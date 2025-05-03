const { Schema, model, Types } = require("mongoose");

const subCategorySchema = new Schema({
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
    description: {
        type: String,
        required: true,
        trim: true
    },
    sub_cat_img: {
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

const SubCategories = new model('SubCategories', subCategorySchema);

module.exports = SubCategories;