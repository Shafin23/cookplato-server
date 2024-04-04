const mongoose = require("mongoose");

const pendingBookingSchema = mongoose.Schema({
    email:{
        type: String
    }, 
    pendingBooking :{
        type: Array
    }

})


module.exports = pendingBookingSchema;