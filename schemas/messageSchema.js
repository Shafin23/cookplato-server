const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    senderEmail: {
        type: String,
        
    },
    receiverEmail: {
        type: String ,
        
    },
    message: {
        type: String, 
        required: true
    },
    time: {
        hours: {
            type: Number,
            required: true
        },
        minutes: {
            type: Number,
            required: true
        }
    }
});

module.exports = messageSchema;
