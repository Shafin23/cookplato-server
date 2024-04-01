const express = require("express"); 
const router = express.Router(); 
const mongoose = require("mongoose"); 
const messageSchema = require("../schemas/messageSchema")
const Message = new mongoose.model("messageCollection", messageSchema)


// Get all messages that has been send to Cook ----------------------------------------------
router.get("/", async (req, res) => {
    try {
        const message = await Message.find();
        res.status(200).json(message)
    }
    catch (error) {
        console.log("eeror while fetching the messages", error)
        res.status(500).json({ error: "janina ki hoise" })
    }
})

// upload message to the database -------------------------------------------------------------
router.post("/addMessage", async (req, res) => {
    const newMessage = new Message(req.body)
    console.log(newMessage)
    try {
        const newMessage = new Message(req.body);
        await newMessage.save();
        res.status(201).json({ message: "Cook added successfully", message: newMessage });
    } catch (error) {
        console.error("Error adding message:", error);
        res.status(500).json({ error: "There was a server side error" });
    }
})

module.exports = router;