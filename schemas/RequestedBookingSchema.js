const mongoose = require("mongoose");

const requestedBookingSchema = mongoose.Schema({
    requestedBooking: {
        type: Array
    }
})

module.exports = requestedBookingSchema;