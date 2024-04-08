const express = require("express");
const router = express.Router();
const { MongoClient } = require("mongodb");

// MongoDB Connection URI
const uri = "mongodb+srv://shafin:bqIoXvqlvI3a6vBn@cluster0.yhuz2xd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";  // Replace this with your MongoDB URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Connect to MongoDB
async function connect() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}
connect();

// Get all messages that have been sent to Cook ----------------------------------------------
router.get("/", async (req, res) => {
    try {
        const messages = await client.db("Cookplato").collection("message").find().toArray();
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error while fetching the messages:", error);
        res.status(500).json({ error: "There was a server side error" });
    }
});

// Upload message to the database -------------------------------------------------------------
router.post("/", async (req, res) => {
    try {
        const newMessage = req.body;
        await client.db("Cookplato").collection("message").insertOne(newMessage);
        res.status(201).json({ message: "Message added successfully", newMessage });
    } catch (error) {
        console.error("Error adding message:", error);
        res.status(500).json({ error: "There was a server side error" });
    }
});

module.exports = router;
