const mongoose = require("mongoose");

const pendingBookingSchema = mongoose.Schema({
    img: String,
    email: String,
    display_name: String,
    total_amount: Number,
    eventAddess: String,
    selectDate: Date,
    message: String,
    foodIssue: String,
    counter: Number,
    dishImg: String,
    name: String,
    category: String

})


module.exports = pendingBookingSchema;