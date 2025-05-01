const { Schema, model } = require('mongoose');

const categorySchema = new Schema({
    name:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    // cat_img: {
    //     type: String,
    //     required: true
    // },
    cat_img: {
        type: {
            url: String,
            public_id: String
        },
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    }
},{
    timestamps: true,
    versionKey: false
})

const Categories = new model('Categories', categorySchema);

module.exports = Categories;