const mongoose = require("mongoose");

const requestedBookingSchema = mongoose.Schema({
    email: {
        type: String
    }, 
    requestedBooking: {
        type: Array
    }
})

module.exports = requestedBookingSchema;