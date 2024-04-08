const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
            message: "Invalid email address format",
        },
    },
    password: {
        type: String,
        required: true
    },
    userRole: {
        type: String,
    },
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    display_name: {
        type: String,
    },
    img: {
        type: String, // Store image as url
    },
    description: {
        type: String,
    },
    dishes: {
        type: Array,
    },
    status: {
        type: String,
    },
    dishImg: {
        type: String
    },
    incomeAsCook:{
        type: String
    },
    costAsCustomer : {
        type: String
    }

});

module.exports = userSchema;
