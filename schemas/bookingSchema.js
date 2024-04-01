const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({

    img: {
        type: String
    },
    email: {
        type: String
    },
    display_name: {
        type: String
    },
    eventAddress: {
        type: String
    },
    total_amount:{
        type: Number
    },
    selectedDate: {
        type: Date
    },
    message: {
        type: String
    },
    foodIssue: {
        type: String
    },
    bookingStatus: {
        type: String
    },
    counter: {
        type: String
    },
    dishImg:{
        type: String
    },
    name:{
        type: String
    },
    category:{
        type: String
    }
})

module.exports = bookingSchema;