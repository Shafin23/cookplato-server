const mongoose = require("mongoose"); 

const confirmBookingSchema = mongoose.Schema({
    email:{
        type: String
    },
    confirmBooking:{
        type: Array
    }
})


module.exports = confirmBookingSchema; 