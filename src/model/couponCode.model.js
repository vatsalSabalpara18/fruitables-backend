const { Schema, model } = require('mongoose');

const couponCodeSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    isActive: {
        type: Boolean,
        required: true,
    },
    discount: {
        type: Number,
        required: true
    },
    from: {
        type: Date,
        required: true
    },
    to: {
        type: Date,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})

const couponCode = new model('CouponCodes', couponCodeSchema);

module.exports = couponCode;