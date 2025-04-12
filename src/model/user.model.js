const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        required: true,                
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true
    },
    password: {
        type: String        
    },
    googleId:{
        type: String
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String        
    }
}, {
    timestamps: true,
    versionKey: false
})

const Users = new model('Users', userSchema);

module.exports = Users;